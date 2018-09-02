"use strict";
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const config_1 = require('./config');
const common_1 = require('./common');
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        }
        else {
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}
exports.mkdirs = mkdirs;
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
exports.mkdirsSync = mkdirsSync;
function isSubPath(from, to) {
    let rel = path.relative(to, from);
    return !(path.isAbsolute(rel) || rel.substr(0, 2) == "..");
}
exports.isSubPath = isSubPath;
function parseError(error) {
    let nb = new Buffer("");
    if (typeof (error) === "string") {
        return [{ error: error, out: nb }];
    }
    else if (error instanceof TypeError || error instanceof Error) {
        let err = error;
        return [{ error: err.stack, out: nb }];
    }
    else if (error instanceof Array) {
        let arr = error;
        if (!arr || !arr.length)
            return [];
        if (instanceOfExportError(arr[0]))
            return error;
    }
    else {
        return [error];
    }
    return null;
    function instanceOfExportError(object) {
        return 'error' in object;
    }
}
exports.parseError = parseError;
function showMessagePanel(message) {
    common_1.outputPanel.clear();
    let errs;
    if (typeof (message) === "string") {
        common_1.outputPanel.appendLine(message);
    }
    else if (errs = parseError(message)) {
        for (let e of errs) {
            common_1.outputPanel.appendLine(e.error);
        }
    }
    else {
        common_1.outputPanel.appendLine(new Object(message).toString());
    }
    common_1.outputPanel.show();
}
exports.showMessagePanel = showMessagePanel;
class StopWatch {
    start() {
        this.startTime = new Date();
    }
    stop() {
        this.endTime = new Date();
        return this.runTime();
    }
    runTime() {
        return this.endTime.getTime() - this.startTime.getTime();
    }
}
exports.StopWatch = StopWatch;
function calculateExportPath(diagram, format) {
    let outDirName = config_1.config.exportOutDirName(diagram.parentUri);
    let subDir = config_1.config.exportSubFolder(diagram.parentUri);
    let dir = "";
    let folder = vscode.workspace.getWorkspaceFolder(diagram.parentUri);
    let wkdir = folder ? folder.uri.fsPath : "";
    //if current document is in workspace, organize exports in 'out' directory.
    //if not, export beside the document.
    if (wkdir && isSubPath(diagram.path, wkdir))
        dir = path.join(wkdir, outDirName);
    let exportDir = diagram.dir;
    if (!path.isAbsolute(exportDir))
        return "";
    if (dir && wkdir) {
        let temp = path.relative(wkdir, exportDir);
        exportDir = path.join(dir, temp);
    }
    if (subDir) {
        exportDir = path.join(exportDir, diagram.fileName);
    }
    return path.join(exportDir, diagram.title + "." + format);
}
exports.calculateExportPath = calculateExportPath;
function addFileIndex(fileName, index, count) {
    if (count == 1)
        return fileName;
    let bsName = path.basename(fileName);
    let ext = path.extname(fileName);
    return path.join(path.dirname(fileName), bsName.substr(0, bsName.length - ext.length) + "-page" + (index + 1) + ext);
}
exports.addFileIndex = addFileIndex;
function processWrapper(process, pipeFilePath) {
    return new Promise((resolve, reject) => {
        let buffOut = [];
        let buffOutLen = 0;
        let buffErr = [];
        let buffErrLen = 0;
        // let pipeFile = pipeFilePath ? fs.createWriteStream(pipeFilePath) : null;
        // if (pipeFile) process.stdout.pipe(pipeFile);
        process.stdout.on('data', function (x) {
            buffOut.push(x);
            buffOutLen += x.length;
        });
        process.stderr.on('data', function (x) {
            buffErr.push(x);
            buffErrLen += x.length;
        });
        process.stdout.on('close', () => {
            let stdout = Buffer.concat(buffOut, buffOutLen);
            if (pipeFilePath && stdout.length) {
                fs.writeFileSync(pipeFilePath, stdout);
                stdout = new Buffer(pipeFilePath);
            }
            let stderr = Buffer.concat(buffErr, buffErrLen);
            resolve([stdout, stderr]);
        });
    });
}
exports.processWrapper = processWrapper;
function testJava(java) {
    let _javaInstalled = false;
    if (!_javaInstalled) {
        try {
            child_process.execSync(java + " -version");
            _javaInstalled = true;
        }
        catch (error) {
            _javaInstalled = false;
        }
    }
    return _javaInstalled;
}
exports.testJava = testJava;
//# sourceMappingURL=tools.js.map