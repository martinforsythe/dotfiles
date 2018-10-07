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
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const common_1 = require('../common');
const config_1 = require('../config');
const tools_1 = require('../tools');
function extractSource() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config_1.config.java) {
            vscode.window.showErrorMessage(common_1.localize(5, null));
            return;
        }
        let imgs = yield vscode.window.showOpenDialog({
            openLabel: common_1.localize(32, null),
            canSelectMany: true,
            filters: { 'Images': ['png'] },
        });
        if (!imgs || !imgs.length)
            return;
        let sources = yield extract(imgs);
        vscode.workspace.openTextDocument({
            language: common_1.languageid,
            content: sources.reduce((srcs, src) => srcs + '\n' + src)
        }).then(doc => vscode.window.showTextDocument(doc));
        common_1.bar.hide();
    });
}
exports.extractSource = extractSource;
function extract(imgs) {
    let sources = [];
    let pms = imgs.reduce((pChain, img, index) => {
        if (!fs.existsSync(img.fsPath)) {
            sources.push("File not found: " + img.fsPath);
            return Promise.resolve(null);
        }
        let params = [
            '-Djava.awt.headless=true',
            '-jar',
            config_1.config.jar,
            "-metadata",
            img.fsPath,
        ];
        // processes.push(process);
        return pChain.then(() => {
            if (common_1.bar) {
                common_1.bar.show();
                common_1.bar.text = common_1.localize(33, null, index + 1, imgs.length, path.basename(img.fsPath));
            }
            let process = child_process.spawn(config_1.config.java, params);
            let pms = tools_1.processWrapper(process).then(result => new Promise((resolve, reject) => {
                let stdout = result[0].toString();
                let stderr = result[1].toString();
                if (stderr.length) {
                    sources.push(stderr);
                }
                else {
                    sources.push(stdout);
                }
                ;
                resolve(null);
            }));
            return pms;
        }, err => {
            console.log(err);
        });
    }, Promise.resolve(null));
    return new Promise((resolve, reject) => {
        pms.then(() => {
            resolve(sources);
        });
    });
}
//# sourceMappingURL=extractSource.js.map