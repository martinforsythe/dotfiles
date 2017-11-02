'use strict';
const vscode = require('vscode');
const proxy = require('./jediProxy');
const telemetryContracts = require("../common/telemetryContracts");
class PythonHoverProvider {
    constructor(context) {
        this.jediProxyHandler = new proxy.JediProxyHandler(context, null, PythonHoverProvider.parseData);
    }
    static parseData(data) {
        if (data && data.items.length > 0) {
            var definition = data.items[0];
            var txt = definition.description || definition.text;
            return new vscode.Hover({ language: "python", value: txt });
        }
        return null;
    }
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            var filename = document.fileName;
            if (document.lineAt(position.line).text.match(/^\s*\/\//)) {
                return resolve();
            }
            if (position.character <= 0) {
                return resolve();
            }
            var range = document.getWordRangeAtPosition(position);
            if (range == undefined || range.isEmpty) {
                return resolve();
            }
            var columnIndex = range.end.character;
            var cmd = {
                telemetryEvent: telemetryContracts.IDE.HoverDefinition,
                command: proxy.CommandType.Completions,
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
exports.PythonHoverProvider = PythonHoverProvider;
//# sourceMappingURL=hoverProvider.js.map