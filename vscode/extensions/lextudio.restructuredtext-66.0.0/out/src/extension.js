"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const RstLanguageServer = require("./rstLsp/extension");
const util = require("./common");
const rstLinter_1 = require("./features/rstLinter");
const rstDocumentContent_1 = require("./features/rstDocumentContent");
const underline_1 = require("./features/underline");
const path = require("path");
const configuration_1 = require("./features/utils/configuration");
const logger_1 = require("./logger");
const ExtensionDownloader_1 = require("./ExtensionDownloader");
let _channel = null;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionId = 'lextudio.restructuredtext';
        const extension = vscode.extensions.getExtension(extensionId);
        util.setExtensionPath(extension.extensionPath);
        _channel = vscode.window.createOutputChannel("reStructuredText");
        _channel.appendLine("Please visit https://www.restructuredtext.net to learn how to configure the extension.");
        _channel.appendLine("The troubleshooting guide can be found at https://www.restructuredtext.net/en/latest/articles/troubleshooting.html.");
        _channel.appendLine("");
        _channel.appendLine("");
        let logger = new logger_1.Logger(text => _channel.append(text));
        var disableLsp = configuration_1.Configuration.loadAnySetting("languageServer.disabled", true);
        //*
        if (!disableLsp) {
            configuration_1.Configuration.setRoot();
            let runtimeDependenciesExist = yield ensureRuntimeDependencies(extension, logger);
        }
        //*/
        // activate language services
        let rstLspPromise = RstLanguageServer.activate(context, _channel, disableLsp);
        let provider = new rstDocumentContent_1.default(context, _channel);
        let registration = vscode.workspace.registerTextDocumentContentProvider("restructuredtext", provider);
        let d1 = vscode.commands.registerCommand("restructuredtext.showPreview", showPreview);
        let d2 = vscode.commands.registerCommand("restructuredtext.showPreviewToSide", uri => showPreview(uri, true));
        let d3 = vscode.commands.registerCommand("restructuredtext.showSource", showSource);
        context.subscriptions.push(d1, d2, d3, registration);
        context.subscriptions.push(vscode.commands.registerTextEditorCommand('restructuredtext.features.underline.underline', underline_1.underline));
        let linter = new rstLinter_1.default();
        linter.activate(context.subscriptions);
        vscode.workspace.onDidSaveTextDocument(document => {
            if (isRstFile(document)) {
                const uri = getRstUri(document.uri);
                provider.update(uri);
            }
        });
        let updateOnTextChanged = configuration_1.Configuration.loadSetting("updateOnTextChanged", "true");
        if (updateOnTextChanged === 'true') {
            vscode.workspace.onDidChangeTextDocument(event => {
                if (isRstFile(event.document)) {
                    const uri = getRstUri(event.document.uri);
                    provider.update(uri);
                }
            });
        }
        vscode.workspace.onDidChangeConfiguration(() => {
            vscode.workspace.textDocuments.forEach(document => {
                if (document.uri.scheme === 'restructuredtext') {
                    // update all generated md documents
                    provider.update(document.uri);
                }
            });
        });
        return {
            initializationFinished: Promise.all([rstLspPromise])
                .then(promiseResult => {
                // This promise resolver simply swallows the result of Promise.all. When we decide we want to expose this level of detail
                // to other extensions then we will design that return type and implement it here.
            })
        };
    });
}
exports.activate = activate;
function ensureRuntimeDependencies(extension, logger) {
    return util.installFileExists(util.InstallFileType.Lock)
        .then(exists => {
        if (!exists) {
            const downloader = new ExtensionDownloader_1.ExtensionDownloader(_channel, logger, extension.packageJSON);
            return downloader.installRuntimeDependencies();
        }
        else {
            return true;
        }
    });
}
function isRstFile(document) {
    return document.languageId === 'restructuredtext'
        && document.uri.scheme !== 'restructuredtext'; // prevent processing of own documents
}
function getRstUri(uri) {
    return uri.with({ scheme: 'restructuredtext', path: uri.path + '.rendered', query: uri.toString() });
}
function showPreview(uri, sideBySide = false) {
    let resource = uri;
    if (!(resource instanceof vscode.Uri)) {
        if (vscode.window.activeTextEditor) {
            // we are relaxed and don't check for markdown files
            resource = vscode.window.activeTextEditor.document.uri;
        }
    }
    if (!(resource instanceof vscode.Uri)) {
        if (!vscode.window.activeTextEditor) {
            // this is most likely toggling the preview
            return vscode.commands.executeCommand('restructuredtext.showSource');
        }
        // nothing found that could be shown or toggled
        return;
    }
    let thenable = vscode.commands.executeCommand('vscode.previewHtml', getRstUri(resource), getViewColumn(sideBySide), `Preview '${path.basename(resource.fsPath)}'`);
    return thenable;
}
function getViewColumn(sideBySide) {
    const active = vscode.window.activeTextEditor;
    if (!active) {
        return vscode.ViewColumn.One;
    }
    if (!sideBySide) {
        return active.viewColumn;
    }
    switch (active.viewColumn) {
        case vscode.ViewColumn.One:
            return vscode.ViewColumn.Two;
        case vscode.ViewColumn.Two:
            return vscode.ViewColumn.Three;
    }
    return active.viewColumn;
}
function showSource(mdUri) {
    if (!mdUri) {
        return vscode.commands.executeCommand('workbench.action.navigateBack');
    }
    const docUri = vscode.Uri.parse(mdUri.query);
    for (let editor of vscode.window.visibleTextEditors) {
        if (editor.document.uri.toString() === docUri.toString()) {
            return vscode.window.showTextDocument(editor.document, editor.viewColumn);
        }
    }
    return vscode.workspace.openTextDocument(docUri).then(doc => {
        return vscode.window.showTextDocument(doc);
    });
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map