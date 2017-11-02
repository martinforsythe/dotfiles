'use strict';
const vscode = require('vscode');
const proxy = require('./jediProxy');
const telemetryContracts = require("../common/telemetryContracts");
class PythonSymbolProvider {
    constructor(context, jediProxy = null) {
        this.jediProxyHandler = new proxy.JediProxyHandler(context, [], PythonSymbolProvider.parseData, jediProxy);
    }
    static parseData(data) {
        if (data) {
            var symbols = data.definitions.map(sym => {
                var symbol = sym.kind;
                var range = new vscode.Range(sym.lineIndex, sym.columnIndex, sym.lineIndex, sym.columnIndex);
                return new vscode.SymbolInformation(sym.text, symbol, range, vscode.Uri.file(sym.fileName));
            });
            return symbols;
        }
        return;
    }
    provideDocumentSymbols(document, token) {
        return new Promise((resolve, reject) => {
            var filename = document.fileName;
            var cmd = {
                telemetryEvent: telemetryContracts.IDE.Symbol,
                command: proxy.CommandType.Symbols,
                fileName: filename,
                columnIndex: 0,
                lineIndex: 0
            };
            if (document.isDirty) {
                cmd.source = document.getText();
            }
            this.jediProxyHandler.sendCommand(cmd, resolve, token);
        });
    }
}
exports.PythonSymbolProvider = PythonSymbolProvider;
//# sourceMappingURL=symbolProvider.js.map