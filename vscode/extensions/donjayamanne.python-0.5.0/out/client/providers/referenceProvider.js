'use strict';
const vscode = require('vscode');
const proxy = require('./jediProxy');
const telemetryContracts = require("../common/telemetryContracts");
class PythonReferenceProvider {
    constructor(context, jediProxy = null) {
        this.jediProxyHandler = new proxy.JediProxyHandler(context, [], PythonReferenceProvider.parseData, jediProxy);
    }
    static parseData(data) {
        if (data && data.references.length > 0) {
            var references = data.references.map(ref => {
                var definitionResource = vscode.Uri.file(ref.fileName);
                var range = new vscode.Range(ref.lineIndex, ref.columnIndex, ref.lineIndex, ref.columnIndex);
                return new vscode.Location(definitionResource, range);
            });
            return references;
        }
        return [];
    }
    provideReferences(document, position, context, token) {
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
                telemetryEvent: telemetryContracts.IDE.Reference,
                command: proxy.CommandType.Usages,
                fileName: filename,
                columnIndex: columnIndex,
                lineIndex: position.line
            };
            if (document.isDirty) {
                cmd.source = document.getText();
            }
            var definition = null;
            this.jediProxyHandler.sendCommand(cmd, resolve, token);
        });
    }
}
exports.PythonReferenceProvider = PythonReferenceProvider;
//# sourceMappingURL=referenceProvider.js.map