"use strict";
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const common_1 = require('./common');
const configReader_1 = require('./configReader');
const tools_1 = require('./tools');
const context_1 = require('./context');
exports.RenderType = {
    Local: 'Local',
    PlantUMLServer: 'PlantUMLServer'
};
class Config extends configReader_1.ConfigReader {
    constructor() {
        super('plantuml');
    }
    onChange() {
        this._jar = "";
        this._java = "";
    }
    get jar() {
        return this._jar || (() => {
            let jar = this.read('jar');
            let intJar = path.join(context_1.contextManager.context.extensionPath, "plantuml.jar");
            if (!jar) {
                jar = intJar;
            }
            else {
                if (!fs.existsSync(jar)) {
                    vscode.window.showWarningMessage(common_1.localize(19, null));
                    jar = intJar;
                }
            }
            this._jar = jar;
            return jar;
        })();
    }
    fileExtensions(uri) {
        let extReaded = this.read('fileExtensions', uri).replace(/\s/g, "");
        let exts = extReaded || ".*";
        if (exts.indexOf(",") > 0)
            exts = `{${exts}}`;
        //REG: .* | .wsd | {.wsd,.java}
        if (!exts.match(/^(.\*|\.\w+|\{\.\w+(,\.\w+)*\})$/)) {
            throw new Error(common_1.localize(18, null, extReaded));
        }
        return exts;
    }
    exportOutDirName(uri) {
        return this.read('exportOutDirName', uri) || "out";
    }
    exportFormat(uri) {
        return this.read('exportFormat', uri);
    }
    exportSubFolder(uri) {
        return this.read('exportSubFolder', uri);
    }
    get exportConcurrency() {
        return this.read('exportConcurrency') || 3;
    }
    exportMapFile(uri) {
        return this.read('exportMapFile', uri) || false;
    }
    get previewAutoUpdate() {
        return this.read('previewAutoUpdate');
    }
    get previewSnapIndicators() {
        return this.read('previewSnapIndicators');
    }
    get server() {
        return this.read('server') || "http://www.plantuml.com/plantuml";
    }
    get serverIndexParameter() {
        return this.read('serverIndexParameter');
    }
    get urlFormat() {
        return this.read('urlFormat');
    }
    get urlResult() {
        return this.read('urlResult') || "MarkDown";
    }
    get render() {
        return this.read('render');
    }
    includes(uri) {
        return this.read('includes', uri);
    }
    get commandArgs() {
        return this.read('commandArgs') || [];
    }
    get jarArgs() {
        return this.read('jarArgs') || [];
    }
    get java() {
        return this._java || (() => {
            let java = this.read('java') || "java";
            if (tools_1.testJava(java)) {
                this._java = java;
            }
            return this._java;
        })();
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map