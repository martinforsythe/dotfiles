"use strict";
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');
const config_1 = require('../config');
const common_1 = require('../common');
const tools_1 = require('../tools');
const context_1 = require('../context');
class LocalRender {
    /**
     * Indicates the exporter should limt concurrency or not.
     * @returns boolean
     */
    limitConcurrency() {
        return true;
    }
    /**
     * formats return an string array of formats that the exporter supports.
     * @returns an array of supported formats
     */
    formats() {
        return [
            "png",
            "svg",
            "eps",
            "pdf",
            "vdx",
            "xmi",
            "scxml",
            "html",
            "txt",
            "utxt",
            "latex",
            "latex:nopreamble"
        ];
    }
    /**
     * export a diagram to file or to Buffer.
     * @param diagram The diagram to export.
     * @param format format of export file.
     * @param savePath if savePath is given, it exports to a file, or, to Buffer.
     * @returns ExportTask.
     */
    render(diagram, format, savePath) {
        return this.createTask(diagram, "-pipe", savePath, format);
    }
    getMapData(diagram, savePath) {
        return this.createTask(diagram, "-pipemap", savePath);
    }
    createTask(diagram, taskType, savePath, format) {
        if (!config_1.config.java) {
            let pms = Promise.reject(common_1.localize(5, null));
            return { promise: pms };
        }
        if (!fs.existsSync(config_1.config.jar)) {
            let pms = Promise.reject(common_1.localize(6, null, context_1.contextManager.context.extensionPath));
            return { promise: pms };
        }
        let processes = [];
        let buffers = [];
        //make a promise chain that export only one page at a time
        //but processes are all started at the begining, and recorded for later process.
        let pms = [...Array(diagram.pageCount).keys()].reduce((pChain, index) => {
            let params = [
                '-Djava.awt.headless=true',
                '-jar',
                config_1.config.jar,
                "-pipeimageindex",
                `${index}`,
                '-charset',
                'utf-8',
            ];
            // Java args
            if (diagram.dir && path.isAbsolute(diagram.dir))
                params.unshift('-Duser.dir=' + diagram.dir);
            // Add user java args
            params.unshift(...config_1.config.commandArgs);
            // Jar args
            params.push(taskType);
            if (format)
                params.push("-t" + format);
            if (diagram.path)
                params.push("-filename", path.basename(diagram.path));
            // Add user jar args
            params.push(...config_1.config.jarArgs);
            let process = child_process.spawn(config_1.config.java, params);
            processes.push(process);
            return pChain.then(() => {
                if (process.killed) {
                    buffers = null;
                    return Promise.resolve(null);
                }
                if (diagram && diagram.content) {
                    process.stdin.write(diagram.content);
                    process.stdin.end();
                }
                let savePath2 = savePath ? tools_1.addFileIndex(savePath, index, diagram.pageCount) : "";
                let pms = tools_1.processWrapper(process, savePath2).then(result => new Promise((resolve, reject) => {
                    let stdout = result[0];
                    let stderr = result[1].toString();
                    if (stderr.length) {
                        stderr = common_1.localize(10, null, diagram.title, stderr);
                        reject({ error: stderr, out: stdout });
                    }
                    else {
                        buffers.push(stdout);
                        resolve(null);
                    }
                    ;
                }));
                return pms;
            }, err => {
                return Promise.reject(err);
            });
        }, Promise.resolve(new Buffer("")));
        return {
            processes: processes,
            promise: new Promise((resolve, reject) => {
                pms.then(() => {
                    resolve(buffers);
                }, err => {
                    reject(err);
                });
            })
        };
    }
}
exports.localRender = new LocalRender();
//# sourceMappingURL=local.js.map