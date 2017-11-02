'use strict';
const vscode = require('vscode');
const systemVariables_1 = require('./systemVariables');
const events_1 = require('events');
const path = require('path');
const IS_TEST_EXECUTION = process.env['PYTHON_DONJAYAMANNE_TEST'] === '1';
const systemVariables = new systemVariables_1.SystemVariables();
class PythonSettings extends events_1.EventEmitter {
    constructor() {
        super();
        if (PythonSettings.pythonSettings) {
            throw new Error('Singleton class, Use getInstance method');
        }
        vscode.workspace.onDidChangeConfiguration(() => {
            this.initializeSettings();
        });
        this.initializeSettings();
    }
    static getInstance() {
        return PythonSettings.pythonSettings;
    }
    initializeSettings() {
        const workspaceRoot = IS_TEST_EXECUTION ? __dirname : vscode.workspace.rootPath;
        let pythonSettings = vscode.workspace.getConfiguration('python');
        this.pythonPath = systemVariables.resolveAny(pythonSettings.get('pythonPath'));
        this.pythonPath = getAbsolutePath(this.pythonPath, IS_TEST_EXECUTION ? __dirname : workspaceRoot);
        this.devOptions = systemVariables.resolveAny(pythonSettings.get('devOptions'));
        this.devOptions = Array.isArray(this.devOptions) ? this.devOptions : [];
        let lintingSettings = systemVariables.resolveAny(pythonSettings.get('linting'));
        if (this.linting) {
            Object.assign(this.linting, lintingSettings);
        }
        else {
            this.linting = lintingSettings;
            if (IS_TEST_EXECUTION && !this.linting) {
                this.linting = {};
            }
        }
        // Support for travis
        this.linting = this.linting ? this.linting : {
            enabled: false,
            flake8Args: [], flake8Enabled: false, flake8Path: 'flake',
            lintOnSave: false, lintOnTextChange: false, maxNumberOfProblems: 100,
            mypyArgs: [], mypyEnabled: false, mypyPath: 'mypy',
            outputWindow: 'python', pep8Args: [], pep8Enabled: false, pep8Path: 'pep8',
            prospectorArgs: [], prospectorEnabled: false, prospectorPath: 'prospector',
            pydocstleArgs: [], pydocstyleEnabled: false, pydocStylePath: 'pydocstyle',
            pylintArgs: [], pylintEnabled: false, pylintPath: 'pylint',
            pylintCategorySeverity: {
                convention: vscode.DiagnosticSeverity.Hint,
                error: vscode.DiagnosticSeverity.Error,
                fatal: vscode.DiagnosticSeverity.Error,
                refactor: vscode.DiagnosticSeverity.Hint,
                warning: vscode.DiagnosticSeverity.Warning
            }
        };
        this.linting.pylintPath = getAbsolutePath(this.linting.pylintPath, workspaceRoot);
        this.linting.flake8Path = getAbsolutePath(this.linting.flake8Path, workspaceRoot);
        this.linting.pep8Path = getAbsolutePath(this.linting.pep8Path, workspaceRoot);
        this.linting.prospectorPath = getAbsolutePath(this.linting.prospectorPath, workspaceRoot);
        this.linting.pydocStylePath = getAbsolutePath(this.linting.pydocStylePath, workspaceRoot);
        let formattingSettings = systemVariables.resolveAny(pythonSettings.get('formatting'));
        if (this.formatting) {
            Object.assign(this.formatting, formattingSettings);
        }
        else {
            this.formatting = formattingSettings;
        }
        // Support for travis
        this.formatting = this.formatting ? this.formatting : {
            autopep8Args: [], autopep8Path: 'autopep8',
            outputWindow: 'python',
            provider: 'autopep8',
            yapfArgs: [], yapfPath: 'yapf'
        };
        this.formatting.autopep8Path = getAbsolutePath(this.formatting.autopep8Path, workspaceRoot);
        this.formatting.yapfPath = getAbsolutePath(this.formatting.yapfPath, workspaceRoot);
        let autoCompleteSettings = systemVariables.resolveAny(pythonSettings.get('autoComplete'));
        if (this.autoComplete) {
            Object.assign(this.autoComplete, autoCompleteSettings);
        }
        else {
            this.autoComplete = autoCompleteSettings;
        }
        // Support for travis
        this.autoComplete = this.autoComplete ? this.autoComplete : {
            extraPaths: []
        };
        let unitTestSettings = systemVariables.resolveAny(pythonSettings.get('unitTest'));
        if (this.unitTest) {
            Object.assign(this.unitTest, unitTestSettings);
        }
        else {
            this.unitTest = unitTestSettings;
            if (IS_TEST_EXECUTION && !this.unitTest) {
                this.unitTest = { nosetestArgs: [], pyTestArgs: [], unittestArgs: [] };
            }
        }
        this.emit('change');
        // Support for travis
        this.unitTest = this.unitTest ? this.unitTest : {
            nosetestArgs: [], nosetestPath: 'nosetest', nosetestsEnabled: false,
            outputWindow: 'python',
            pyTestArgs: [], pyTestEnabled: false, pyTestPath: 'pytest',
            unittestArgs: [], unittestEnabled: false
        };
        this.unitTest.pyTestPath = getAbsolutePath(this.unitTest.pyTestPath, workspaceRoot);
        this.unitTest.nosetestPath = getAbsolutePath(this.unitTest.nosetestPath, workspaceRoot);
        // Resolve any variables found in the test arguments
        this.unitTest.nosetestArgs = this.unitTest.nosetestArgs.map(arg => systemVariables.resolveAny(arg));
        this.unitTest.pyTestArgs = this.unitTest.pyTestArgs.map(arg => systemVariables.resolveAny(arg));
        this.unitTest.unittestArgs = this.unitTest.unittestArgs.map(arg => systemVariables.resolveAny(arg));
        let terminalSettings = systemVariables.resolveAny(pythonSettings.get('terminal'));
        if (this.terminal) {
            Object.assign(this.terminal, terminalSettings);
        }
        else {
            this.terminal = terminalSettings;
            if (IS_TEST_EXECUTION && !this.terminal) {
                this.terminal = {};
            }
        }
        // Support for travis
        this.terminal = this.terminal ? this.terminal : {
            executeInFileDir: true,
            launchArgs: []
        };
        this.jupyter = pythonSettings.get('jupyter');
        // Support for travis
        this.jupyter = this.jupyter ? this.jupyter : {
            appendResults: true, defaultKernel: '', startupCode: []
        };
    }
}
PythonSettings.pythonSettings = new PythonSettings();
exports.PythonSettings = PythonSettings;
function getAbsolutePath(pathToCheck, rootDir) {
    if (IS_TEST_EXECUTION && !pathToCheck) {
        return rootDir;
    }
    if (pathToCheck.indexOf(path.sep) === -1) {
        return pathToCheck;
    }
    return path.isAbsolute(pathToCheck) ? pathToCheck : path.resolve(rootDir, pathToCheck);
}
//# sourceMappingURL=configSettings.js.map