"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const diagram_1 = require('../diagram/diagram');
const exportDiagrams_1 = require('./exportDiagrams');
/**
 * export diagrams of a vscode.Uri to file
 * @param file the uri and format to export.
 * @param bar display prcessing message in bar if it's given.
 * @returns Promise<Buffer[][]>. A promise of Buffer[digrams][pages] array
 */
function exportFile(file, bar) {
    return __awaiter(this, void 0, void 0, function* () {
        let doc = yield vscode.workspace.openTextDocument(file.uri);
        let diagrams = diagram_1.diagramsOf(doc);
        if (!diagrams.length)
            return Promise.resolve([]);
        return exportDiagrams_1.exportDiagrams(diagrams, file.format, bar);
    });
}
exports.exportFile = exportFile;
//# sourceMappingURL=exportURI.js.map