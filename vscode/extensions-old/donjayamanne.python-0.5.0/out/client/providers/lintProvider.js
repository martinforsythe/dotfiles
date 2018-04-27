'use strict';
const vscode = require('vscode');
const linter = require('../linters/baseLinter');
const prospector = require('./../linters/prospector');
const pylint = require('./../linters/pylint');
const pep8 = require('./../linters/pep8Linter');
const flake8 = require('./../linters/flake8');
const pydocstyle = require('./../linters/pydocstyle');
const mypy = require('./../linters/mypy');
const settings = require('../common/configSettings');
const telemetryHelper = require('../common/telemetry');
const telemetryContracts = require('../common/telemetryContracts');
const constants_1 = require('../common/constants');
const lintSeverityToVSSeverity = new Map();
lintSeverityToVSSeverity.set(linter.LintMessageSeverity.Error, vscode.DiagnosticSeverity.Error);
lintSeverityToVSSeverity.set(linter.LintMessageSeverity.Hint, vscode.DiagnosticSeverity.Hint);
lintSeverityToVSSeverity.set(linter.LintMessageSeverity.Information, vscode.DiagnosticSeverity.Information);
lintSeverityToVSSeverity.set(linter.LintMessageSeverity.Warning, vscode.DiagnosticSeverity.Warning);
function createDiagnostics(message, txtDocumentLines) {
    let sourceLine = txtDocumentLines[message.line - 1];
    let sourceStart = sourceLine.substring(message.column - 1);
    let endCol = txtDocumentLines[message.line - 1].length;
    // try to get the first word from the startig position
    if (message.possibleWord === 'string' && message.possibleWord.length > 0) {
        endCol = message.column + message.possibleWord.length;
    }
    let range = new vscode.Range(new vscode.Position(message.line - 1, message.column), new vscode.Position(message.line - 1, endCol));
    let severity = lintSeverityToVSSeverity.get(message.severity);
    let diagnostic = new vscode.Diagnostic(range, message.code + ':' + message.message, severity);
    diagnostic.code = message.code;
    diagnostic.source = message.provider;
    return diagnostic;
}
class LintProvider extends vscode.Disposable {
    constructor(context, outputChannel, workspaceRootPath, documentHasJupyterCodeCells) {
        super(() => { });
        this.workspaceRootPath = workspaceRootPath;
        this.documentHasJupyterCodeCells = documentHasJupyterCodeCells;
        this.linters = [];
        this.pendingLintings = new Map();
        this.outputChannel = outputChannel;
        this.context = context;
        this.settings = settings.PythonSettings.getInstance();
        this.initialize();
    }
    isDocumentOpen(uri) {
        return vscode.window.visibleTextEditors.some(editor => editor.document && editor.document.uri.fsPath === uri.fsPath);
    }
    initialize() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('python');
        this.linters.push(new prospector.Linter(this.outputChannel, this.workspaceRootPath));
        this.linters.push(new pylint.Linter(this.outputChannel, this.workspaceRootPath));
        this.linters.push(new pep8.Linter(this.outputChannel, this.workspaceRootPath));
        this.linters.push(new flake8.Linter(this.outputChannel, this.workspaceRootPath));
        this.linters.push(new pydocstyle.Linter(this.outputChannel, this.workspaceRootPath));
        this.linters.push(new mypy.Linter(this.outputChannel, this.workspaceRootPath));
        let disposable = vscode.workspace.onDidSaveTextDocument((e) => {
            if (e.languageId !== 'python' || !this.settings.linting.enabled || !this.settings.linting.lintOnSave) {
                return;
            }
            this.lintDocument(e, e.uri, e.getText().split(/\r?\n/g), 100);
        });
        this.context.subscriptions.push(disposable);
        disposable = vscode.workspace.onDidCloseTextDocument(textDocument => {
            if (!textDocument || !textDocument.fileName || !textDocument.uri) {
                return;
            }
            // Check if this document is still open as a duplicate editor
            if (this.isDocumentOpen(textDocument.uri) && this.diagnosticCollection.has(textDocument.uri)) {
                this.diagnosticCollection.set(textDocument.uri, []);
            }
        });
        this.context.subscriptions.push(disposable);
    }
    lintDocument(document, documentUri, documentLines, delay) {
        // Since this is a hack, lets wait for 2 seconds before linting
        // Give user to continue typing before we waste CPU time
        if (this.lastTimeout) {
            clearTimeout(this.lastTimeout);
            this.lastTimeout = 0;
        }
        this.lastTimeout = setTimeout(() => {
            this.onLintDocument(document, documentUri, documentLines);
        }, delay);
    }
    onLintDocument(document, documentUri, documentLines) {
        if (this.pendingLintings.has(documentUri.fsPath)) {
            this.pendingLintings.get(documentUri.fsPath).cancel();
            this.pendingLintings.delete(documentUri.fsPath);
        }
        let cancelToken = new vscode.CancellationTokenSource();
        cancelToken.token.onCancellationRequested(() => {
            if (this.pendingLintings.has(documentUri.fsPath)) {
                this.pendingLintings.delete(documentUri.fsPath);
            }
        });
        this.pendingLintings.set(documentUri.fsPath, cancelToken);
        this.outputChannel.clear();
        let promises = this.linters.map(linter => {
            if (!linter.isEnabled()) {
                return Promise.resolve([]);
            }
            let delays = new telemetryHelper.Delays();
            return linter.runLinter(documentUri.fsPath, documentLines).then(results => {
                delays.stop();
                telemetryHelper.sendTelemetryEvent(telemetryContracts.IDE.Lint, { Lint_Provider: linter.Id }, delays.toMeasures());
                return results;
            });
        });
        this.documentHasJupyterCodeCells(document, cancelToken.token).then(hasJupyterCodeCells => {
            // linters will resolve asynchronously - keep a track of all 
            // diagnostics reported as them come in
            let diagnostics = [];
            promises.forEach(p => {
                p.then(msgs => {
                    if (cancelToken.token.isCancellationRequested) {
                        return;
                    }
                    // Build the message and suffix the message with the name of the linter used
                    msgs.forEach(d => {
                        // ignore magic commands from jupyter
                        if (hasJupyterCodeCells && documentLines[d.line - 1].trim().startsWith('%') &&
                            (d.code === constants_1.LinterErrors.pylint.InvalidSyntax ||
                                d.code === constants_1.LinterErrors.prospector.InvalidSyntax ||
                                d.code === constants_1.LinterErrors.flake8.InvalidSyntax)) {
                            return;
                        }
                        diagnostics.push(createDiagnostics(d, documentLines));
                    });
                    // Limit the number of messages to the max value
                    diagnostics = diagnostics.filter((value, index) => index <= this.settings.linting.maxNumberOfProblems);
                    if (!this.isDocumentOpen(documentUri)) {
                        diagnostics = [];
                    }
                    // set all diagnostics found in this pass, as this method always clears existing diagnostics.
                    this.diagnosticCollection.set(documentUri, diagnostics);
                });
            });
        });
    }
}
exports.LintProvider = LintProvider;
//# sourceMappingURL=lintProvider.js.map