"use strict";
const vscode = require('vscode');
const constants_1 = require('../../common/constants');
class CellOptions extends vscode.Disposable {
    constructor(cellCodeLenses) {
        super(() => { });
        this.cellCodeLenses = cellCodeLenses;
        this.disposables = [];
        this.registerCommands();
    }
    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
    registerCommands() {
        this.disposables.push(vscode.commands.registerCommand(constants_1.Commands.Jupyter.Cell.DisplayCellMenu, this.displayCellOptions.bind(this)));
        this.disposables.push(vscode.commands.registerCommand(constants_1.Commands.Jupyter.Cell.AdcanceToCell, this.advanceToCell.bind(this)));
        this.disposables.push(vscode.commands.registerCommand(constants_1.Commands.Jupyter.Cell.ExecuteCurrentCell, this.executeCell.bind(this, false)));
        this.disposables.push(vscode.commands.registerCommand(constants_1.Commands.Jupyter.Cell.ExecuteCurrentCellAndAdvance, this.executeCell.bind(this, true)));
        this.disposables.push(vscode.commands.registerCommand(constants_1.Commands.Jupyter.Cell.GoToNextCell, this.goToNextCell.bind(this)));
        this.disposables.push(vscode.commands.registerCommand(constants_1.Commands.Jupyter.Cell.GoToPreviousCell, this.goToPreviousCell.bind(this)));
    }
    getActiveCell() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || !activeEditor.document) {
            return Promise.resolve(null);
        }
        return this.cellCodeLenses.provideCodeLenses(activeEditor.document, null).then(lenses => {
            let currentCellRange;
            let nextCellRange;
            let previousCellRange;
            lenses.forEach((lens, index) => {
                if (lens.range.contains(activeEditor.selection.start)) {
                    currentCellRange = lens.range;
                    if (index < (lenses.length - 1)) {
                        nextCellRange = lenses[index + 1].range;
                    }
                    if (index > 0) {
                        previousCellRange = lenses[index - 1].range;
                    }
                }
            });
            if (!currentCellRange) {
                return null;
            }
            return { cell: currentCellRange, nextCell: nextCellRange, previousCell: previousCellRange };
        });
    }
    goToPreviousCell() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || !activeEditor.document) {
            return Promise.resolve();
        }
        return this.getActiveCell().then(cellInfo => {
            if (!cellInfo || !cellInfo.previousCell) {
                return;
            }
            return this.advanceToCell(activeEditor.document, cellInfo.previousCell);
        });
    }
    goToNextCell() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || !activeEditor.document) {
            return Promise.resolve();
        }
        return this.getActiveCell().then(cellInfo => {
            if (!cellInfo || !cellInfo.nextCell) {
                return;
            }
            return this.advanceToCell(activeEditor.document, cellInfo.nextCell);
        });
    }
    executeCell(advanceToNext) {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || !activeEditor.document) {
            return Promise.resolve();
        }
        return this.getActiveCell().then(cellInfo => {
            if (!cellInfo || !cellInfo.cell) {
                return;
            }
            return vscode.commands.executeCommand(constants_1.Commands.Jupyter.ExecuteRangeInKernel, activeEditor.document, cellInfo.cell).then(() => {
                if (!advanceToNext) {
                    return;
                }
                return this.advanceToCell(activeEditor.document, cellInfo.nextCell);
            });
        });
    }
    advanceToCell(document, range) {
        if (!range || !document) {
            return;
        }
        const textEditor = vscode.window.visibleTextEditors.find(editor => editor.document && editor.document.fileName === document.fileName);
        if (!textEditor) {
            return;
        }
        // Remember, we use comments to identify cells
        // Setting the cursor to the comment doesn't make sense
        // Quirk 1: Besides the document highlighter doesn't kick in (event' not fired), when you have placed the cursor on a comment
        // Quirk 2: If the first character starts with a %, then for some reason the highlighter doesn't kick in (event' not fired)
        let firstLineOfCellRange = range;
        if (range.start.line < range.end.line) {
            // let line = textEditor.document.lineAt(range.start.line + 1);
            // let start = new vscode.Position(range.start.line + 1, range.start.character);
            // firstLineOfCellRange = new vscode.Range(start, range.end);
            const start = this.findStartPositionWithCode(document, range.start.line + 1, range.end.line);
            firstLineOfCellRange = new vscode.Range(start, range.end);
        }
        textEditor.selections = [];
        textEditor.selection = new vscode.Selection(firstLineOfCellRange.start, firstLineOfCellRange.start);
        textEditor.revealRange(range);
        vscode.window.showTextDocument(textEditor.document);
    }
    displayCellOptions(document, range, nextCellRange) {
        const items = [
            {
                label: 'Run cell',
                description: '',
                command: constants_1.Commands.Jupyter.ExecuteRangeInKernel,
                args: [document, range]
            }];
        if (nextCellRange) {
            items.push({
                label: 'Run cell and advance',
                description: '',
                command: constants_1.Commands.Jupyter.ExecuteRangeInKernel,
                args: [document, range],
                postCommand: constants_1.Commands.Jupyter.Cell.AdcanceToCell,
                postArgs: [document, nextCellRange]
            });
        }
        vscode.window.showQuickPick(items).then(item => {
            if (item) {
                vscode.commands.executeCommand(item.command, ...item.args).then(() => {
                    if (item.postCommand) {
                        vscode.commands.executeCommand(item.postCommand, ...item.postArgs);
                    }
                });
            }
        });
    }
    findStartPositionWithCode(document, startLine, endLine) {
        for (let lineNumber = startLine; lineNumber < endLine; lineNumber++) {
            let line = document.lineAt(startLine);
            if (line.isEmptyOrWhitespace) {
                continue;
            }
            const lineText = line.text;
            const trimmedLine = lineText.trim();
            if (trimmedLine.startsWith('#')) {
                continue;
            }
            // Yay we have a line
            // Remember, we need to set the cursor to a character other than white space
            // Highlighting doesn't kick in for comments or white space
            return new vscode.Position(lineNumber, lineText.indexOf(trimmedLine));
        }
        // give up
        return new vscode.Position(startLine, 0);
    }
}
exports.CellOptions = CellOptions;
//# sourceMappingURL=cellOptions.js.map