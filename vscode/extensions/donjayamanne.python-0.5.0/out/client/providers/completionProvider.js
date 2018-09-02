'use strict';
const vscode = require('vscode');
const proxy = require('./jediProxy');
const telemetryContracts = require('../common/telemetryContracts');
class PythonCompletionItemProvider {
    constructor(context) {
        this.jediProxyHandler = new proxy.JediProxyHandler(context, [], PythonCompletionItemProvider.parseData);
    }
    static parseData(data) {
        if (data && data.items.length > 0) {
            return data.items.map(item => {
                let completionItem = new vscode.CompletionItem(item.text);
                completionItem.kind = item.type;
                completionItem.documentation = item.description;
                // ensure the built in memebers are at the bottom
                completionItem.sortText = (completionItem.label.startsWith('__') ? 'z' : (completionItem.label.startsWith('_') ? 'y' : '__')) + completionItem.label;
                return completionItem;
            });
        }
        return [];
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            const filename = document.fileName;
            if (document.lineAt(position.line).text.match(/^\s*\/\//)) {
                return resolve([]);
            }
            if (position.character <= 0) {
                return resolve([]);
            }
            const txt = document.getText(new vscode.Range(new vscode.Position(position.line, position.character - 1), position));
            const type = proxy.CommandType.Completions;
            const columnIndex = position.character;
            const source = document.getText();
            const cmd = {
                telemetryEvent: telemetryContracts.IDE.Completion,
                command: type,
                fileName: filename,
                columnIndex: columnIndex,
                lineIndex: position.line,
                source: source
            };
            this.jediProxyHandler.sendCommand(cmd, resolve, token);
        });
    }
}
exports.PythonCompletionItemProvider = PythonCompletionItemProvider;
//# sourceMappingURL=completionProvider.js.map