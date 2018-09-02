'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Configuration {
    static loadAnySetting(configSection, defaultValue, header = "restructuredtext") {
        return vscode_1.workspace.getConfiguration(header).get(configSection, defaultValue);
    }
    static loadSetting(configSection, defaultValue, header = "restructuredtext", expand = true) {
        var result = this.loadAnySetting(configSection, defaultValue, header);
        if (expand && result != null) {
            return this.expandMacro(result);
        }
        return result;
    }
    static setRoot() {
        var old = vscode_1.workspace.getConfiguration("restructuredtext").get("workspaceRoot");
        if (old.indexOf("${workspaceRoot}") > -1) {
            vscode_1.workspace.getConfiguration("restructuredtext").update("workspaceRoot", this.expandMacro(old));
        }
    }
    static expandMacro(input) {
        let root = vscode_1.workspace.rootPath;
        return input.replace("${workspaceRoot}", root);
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map