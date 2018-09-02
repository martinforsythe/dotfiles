"use strict";
const vscode_1 = require('vscode');
const CellIdentifier = /^(# %%|#%%|# \<codecell\>|# In\[\d?\]|# In\[ \])(.*)/i;
class CellHelper {
    constructor() {
    }
    static getCells(document) {
        const cells = [];
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            if (CellIdentifier.test(line.text)) {
                const results = CellIdentifier.exec(line.text);
                if (cells.length > 0) {
                    const previousCell = cells[cells.length - 1];
                    previousCell.range = new vscode_1.Range(previousCell.range.start, document.lineAt(index - 1).range.end);
                }
                cells.push({
                    range: line.range,
                    title: results.length > 1 ? results[2].trim() : ''
                });
            }
        }
        if (cells.length >= 1) {
            const line = document.lineAt(document.lineCount - 1);
            const previousCell = cells[cells.length - 1];
            previousCell.range = new vscode_1.Range(previousCell.range.start, line.range.end);
        }
        return cells;
    }
}
exports.CellHelper = CellHelper;
//# sourceMappingURL=cells.js.map