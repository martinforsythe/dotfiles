"use strict";
const vscode = require('vscode');
const nls = require("vscode-nls");
const path_1 = require("path");
const context_1 = require('./context');
exports.languageid = "diagram";
exports.outputPanel = vscode.window.createOutputChannel("PlantUML");
exports.bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
context_1.contextManager.addInitiatedListener(ctx => {
    nls.config({ locale: vscode.env.language });
    exports.localize = nls.loadMessageBundle(path_1.join(ctx.extensionPath, "langs", "lang.json"));
});
//# sourceMappingURL=common.js.map