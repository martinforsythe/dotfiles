"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const underline = require("../src/features/underline");
suite("reStructuredText tests", () => {
    test("editor underlines title", done => {
        let textEditor;
        let textDocument;
        vscode.workspace.openTextDocument({ content: 'hello', language: 'reStructuredText' }).then(document => {
            textDocument = document;
            return vscode.window.showTextDocument(textDocument);
        }).then(editor => {
            let textEditor = editor;
            const newpos = new vscode.Position(0, 5);
            editor.selection = new vscode.Selection(newpos, newpos);
            return editor.edit(edit => {
                underline.underline(editor, edit, null);
            });
        }).then(() => {
            assert.equal(textDocument.getText(), 'hello\n=====');
        }).then(done, done);
    });
    test("editor toggles title level", done => {
        let textEditor;
        let textDocument;
        vscode.workspace.openTextDocument({ content: 'hello\n=====', language: 'reStructuredText' }).then(document => {
            textDocument = document;
            return vscode.window.showTextDocument(textDocument);
        }).then(editor => {
            let textEditor = editor;
            const newpos = new vscode.Position(0, 5);
            editor.selection = new vscode.Selection(newpos, newpos);
            return editor.edit(edit => {
                underline.underline(editor, edit, null);
            });
        }).then(() => {
            assert.equal(textDocument.getText(), 'hello\n-----');
        }).then(done, done);
    });
    test("nextLineChar", () => {
        assert.equal(underline.nextUnderlineChar('='), '-');
        assert.equal(underline.nextUnderlineChar('-'), '~');
        assert.equal(underline.nextUnderlineChar('~'), '+');
        assert.equal(underline.nextUnderlineChar('+'), '=');
    });
});
//# sourceMappingURL=extension.test.js.map