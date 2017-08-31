'use strict';
const vscode = require('vscode');
const proxy = require('./jediProxy');
const telemetryContracts = require("../common/telemetryContracts");
class PythonDefinitionProvider {
    constructor(context) {
        this.jediProxyHandler = new proxy.JediProxyHandler(context, null, PythonDefinitionProvider.parseData);
    }
    get JediProxy() {
        return this.jediProxyHandler.JediProxy;
    }
    static parseData(data) {
        if (data && data.definition) {
            var definitionResource = vscode.Uri.file(data.definition.fileName);
            var range = new vscode.Range(data.definition.lineIndex, data.definition.columnIndex, data.definition.lineIndex, data.definition.columnIndex);
            return new vscode.Location(definitionResource, range);
        }
        return null;
    }
    provideDefinition(document, position, token) {
        return new Promise((resolve, reject) => {
            var filename = document.fileName;
            if (document.lineAt(position.line).text.match(/^\s*\/\//)) {
                return resolve();
            }
            if (position.character <= 0) {
                return resolve();
            }
            var range = document.getWordRangeAtPosition(position);
            var columnIndex = range.isEmpty ? position.character : range.end.character;
            var cmd = {
                telemetryEvent: telemetryContracts.IDE.Definition,
                command: proxy.CommandType.Definitions,
                fileName: filename,
                columnIndex: columnIndex,
                lineIndex: position.line
            };
            if (document.isDirty) {
                cmd.source = document.getText();
            }
            this.jediProxyHandler.sendCommand(cmd, resolve, token);
        });
    }
}
exports.PythonDefinitionProvider = PythonDefinitionProvider;
//# sourceMappingURL=definitionProvider.js.map