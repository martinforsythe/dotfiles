"use strict";
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const config_1 = require('../config');
const context_1 = require('../context');
class Includer {
    constructor() {
        this._calculated = {};
    }
    addIncludes(diagram) {
        let folder = vscode.workspace.getWorkspaceFolder(diagram.parentUri);
        let folderPath = folder ? folder.uri.fsPath : "";
        let folderUri = folder ? folder.uri : undefined;
        let cache = this._calculated[folderPath];
        if (!cache || cache.settings != config_1.config.includes(folderUri).sort().toString()) {
            cache = this._calcIncludes(folderUri);
            this._calculated[folderPath] = cache;
        }
        if (cache.includes)
            diagram.content = diagram.content.replace(/\n\s*'\s*autoinclude\s*\n/i, `${cache.includes}\n`);
        return diagram;
    }
    _calcIncludes(uri) {
        let includes = "";
        let confs = config_1.config.includes(uri);
        let paths = [];
        for (let c of confs) {
            if (!c)
                continue;
            if (!path.isAbsolute(c)) {
                let ws = uri ? this._findWorkspace(uri.fsPath, c) : [];
                let inte = this._findIntegrated(c);
                paths.push(...ws, ...inte);
                continue;
            }
            if (fs.existsSync(c))
                paths.push(c);
        }
        return {
            settings: confs.sort().toString(),
            includes: paths.reduce((pre, cur) => `${pre}\n!include ${cur}`, ""),
        };
    }
    _findWorkspace(folder, conf) {
        if (!folder)
            return [];
        conf = path.join(folder, conf);
        if (fs.existsSync(conf)) {
            if (fs.statSync(conf).isDirectory())
                return fs.readdirSync(conf).map(f => path.join(conf, f));
            return [conf];
        }
        return [];
    }
    _findIntegrated(p) {
        p = path.join(context_1.contextManager.context.extensionPath, "includes", p + ".wsd");
        if (fs.existsSync(p))
            return [p];
        return [];
    }
}
exports.includer = new Includer();
//# sourceMappingURL=includer.js.map