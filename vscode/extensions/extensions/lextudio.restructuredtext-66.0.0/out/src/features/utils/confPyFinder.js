'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
class ConfPyFinder {
    static findConfDir(rstPath, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanity check - the file we are previewing must exist
            if (!fs.existsSync(rstPath) || !fs.statSync(rstPath).isFile) {
                return Promise.reject("RST extension got invalid file name: " + rstPath);
            }
            let paths = [];
            // A path may be configured
            let confPathFromSettings = configuration_1.Configuration.loadSetting("confPath", null);
            if (confPathFromSettings != null) {
                channel.appendLine("Using Spinx conf.py path from " +
                    "restructuredtext.confPath settings: " + confPathFromSettings);
                return Promise.resolve(confPathFromSettings);
            }
            // Add path to a directory containing conf.py if it is not already stored
            function addPaths(pathsToAdd) {
                pathsToAdd.forEach(confPath => {
                    let pth = path.dirname(confPath);
                    if (paths.indexOf(pth) == -1)
                        paths.push(pth);
                });
            }
            // Search for unique conf.py paths in the workspace and in parent
            // directories (useful when opening a single file, not a workspace)
            const paths1 = yield findConfPyFiles();
            const paths2 = findConfPyFilesInParentDirs(rstPath);
            addPaths(paths1);
            addPaths(paths2);
            channel.appendLine("Found conf.py paths: " + JSON.stringify(paths));
            // Default to the workspace root path if nothing was found
            if (paths.length == 0)
                return Promise.resolve(vscode_1.workspace.rootPath);
            // Found only one conf.py, using that one
            if (paths.length == 1) {
                return Promise.resolve(paths[0]);
            }
            // Found multiple conf.py files, let the user decide
            return vscode_1.window.showQuickPick(paths, {
                placeHolder: `Select 1 of ${paths.length} Sphinx directories`
            });
        });
    }
}
exports.ConfPyFinder = ConfPyFinder;
/**
 * Returns a list of conf.py files in the workspace
 */
function findConfPyFiles() {
    if (!vscode_1.workspace.workspaceFolders) {
        return Promise.resolve([]);
    }
    return vscode_1.workspace.findFiles(
    /*include*/ '{**/conf.py}', 
    /*exclude*/ '{}', 
    /*maxResults*/ 100)
        .then(urisToPaths);
}
function urisToPaths(uris) {
    let paths = [];
    uris.forEach(uri => paths.push(uri.fsPath));
    return paths;
}
/**
 * Find conf.py files by looking at parent directories. Useful in case
 * a single rst file is opened without a workspace
 */
function findConfPyFilesInParentDirs(rstPath) {
    let paths = [];
    // Walk the directory up from the RST file directory looking for the conf.py file
    let dirName = rstPath;
    while (true) {
        // Get the name of the parent directory
        let parentDir = path.normalize(dirName + "/..");
        // Check if we are at the root directory already to avoid an infinte loop
        if (parentDir == dirName)
            break;
        // Sanity check - the parent directory must exist
        if (!fs.existsSync(parentDir) || !fs.statSync(parentDir).isDirectory)
            break;
        // Check this directory for conf.py
        let confPath = path.join(parentDir, "conf.py");
        if (fs.existsSync(confPath) && fs.statSync(confPath).isFile)
            paths.push(confPath);
        dirName = parentDir;
    }
    return paths;
}
//# sourceMappingURL=confPyFinder.js.map