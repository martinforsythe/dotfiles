'use strict';
const vscode = require('vscode');
const proxy_1 = require('../refactor/proxy');
const editor_1 = require('../common/editor');
const path = require('path');
const configSettings_1 = require('../common/configSettings');
const pythonSettings = configSettings_1.PythonSettings.getInstance();
const EXTENSION_DIR = path.join(__dirname, '..', '..', '..');
class PythonRenameProvider {
    provideRenameEdits(document, position, newName, token) {
        return vscode.workspace.saveAll(false).then(() => {
            return this.doRename(document, position, newName, token);
        });
    }
    doRename(document, position, newName, token) {
        var filename = document.fileName;
        if (document.lineAt(position.line).text.match(/^\s*\/\//)) {
            return;
        }
        if (position.character <= 0) {
            return;
        }
        var source = document.getText();
        var range = document.getWordRangeAtPosition(position);
        if (range == undefined || range == null || range.isEmpty) {
            return;
        }
        const oldName = document.getText(range);
        if (oldName === newName) {
            return;
        }
        let proxy = new proxy_1.RefactorProxy(EXTENSION_DIR, pythonSettings, vscode.workspace.rootPath);
        return new Promise(resolve => {
            proxy.rename(document, newName, document.uri.fsPath, range).then(response => {
                //return response.results[0].diff;
                const workspaceEdit = editor_1.getWorkspaceEditsFromPatch(response.results.map(fileChanges => fileChanges.diff));
                resolve(workspaceEdit);
            });
        });
    }
}
exports.PythonRenameProvider = PythonRenameProvider;
//# sourceMappingURL=renameProvider.js.map