'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
let fileUrl = require("file-url");
const child_process_1 = require("child_process");
const configuration_1 = require("./utils/configuration");
class RstDocumentContentProvider {
    constructor(context, channel) {
        this._onDidChange = new vscode_1.EventEmitter();
        this._context = context;
        this._waiting = false;
        this._channel = channel;
        context.subscriptions.push(this._channel);
    }
    provideTextDocumentContent(uri) {
        let root = vscode_1.workspace.rootPath;
        this._channel.appendLine("${workspaceRoot}: " + root);
        this._timeout = configuration_1.Configuration.loadAnySetting("updateDelay", 300);
        this._input = configuration_1.Configuration.loadSetting("confPath", root);
        this._channel.appendLine("confPath: " + this._input);
        this._output = configuration_1.Configuration.loadSetting("builtDocumentationPath", path.join(root, "_build", "html"));
        this._channel.appendLine("builtDocumentationPath: " + this._output);
        let quotedOutput = "\"" + this._output + "\"";
        var build = configuration_1.Configuration.loadSetting('sphinxBuildPath', null);
        if (build == null) {
            var python = configuration_1.Configuration.loadSetting("pythonPath", null, "python");
            if (python != null) {
                build = python + " -m sphinx";
            }
        }
        if (build == null) {
            build = "sphinx-build";
        }
        this._options = { cwd: this._input };
        this._cmd = [
            build,
            "-b html",
            ".",
            quotedOutput
        ].join(" ");
        return this.preview(uri);
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        if (!this._waiting) {
            this._waiting = true;
            setTimeout(() => {
                this._waiting = false;
                this._onDidChange.fire(uri);
            }, this._timeout);
        }
    }
    errorSnippet(error) {
        return `
                <body>
                    ${error}
                </body>`;
    }
    fixLinks(document, documentPath) {
        return document.replace(new RegExp("((?:src|href)=[\'\"])(.*?)([\'\"])", "gmi"), (subString, p1, p2, p3) => {
            return [
                p1,
                fileUrl(path.join(path.dirname(documentPath), p2)),
                p3
            ].join("");
        });
    }
    showHelp(description, error) {
        let help = "<body>\
          <section>\
            <article>\
              <header>\
                <h2>Cannot show preview page.</h2>\
                <h4>Description:</h4>\
                <p>" + description + "</p>\
                <h4>Detailed error message</h4>\
                <pre>" + error + "</pre>\
                <h4>More Information</h4>\
                <p>Diagnostics information has been written to OUTPUT | reStructuredText panel.</p>\
                <p>The troubleshooting guide can be found at</p>\
                <pre>https://www.restructuredtext.net/en/latest/articles/troubleshooting.html</pre>\
              </header>\
            </article>\
          </section>\
        </body>";
        return help;
    }
    showError(description, errorMessage) {
        console.error(description);
        console.error(errorMessage);
        this._channel.appendLine("Description: " + description);
        this._channel.appendLine("Error: " + errorMessage);
        return this.showHelp(description, errorMessage);
    }
    relativeDocumentationPath(whole) {
        return whole.substring(this._input.length);
    }
    preview(uri) {
        let confFile = path.join(this._input, "conf.py");
        var fs = require('fs');
        if (!fs.existsSync(confFile)) {
            return this.showError("Cannot find 'conf.py'. Please review the value of 'restructuredtext.confPath' in Workspace Settings.", "Current 'conf.py' setting is '" + confFile + "'.");
        }
        // Calculate full path to built html file.
        let whole = uri.fsPath;
        if (whole.endsWith(".rendered"))
            whole = whole.substring(0, whole.lastIndexOf("."));
        let ext = whole.lastIndexOf(".");
        whole = whole.substring(0, ext) + ".html";
        let finalName = path.join(this._output, this.relativeDocumentationPath(whole));
        this._channel.appendLine("Source file: " + uri.fsPath);
        this._channel.appendLine("Compiler: " + this._cmd);
        this._channel.appendLine("HTML file: " + finalName);
        // Display file.
        return new Promise((resolve, reject) => {
            child_process_1.exec(this._cmd, this._options, (error, stdout, stderr) => {
                if (error) {
                    let description = "Cannot run sphinx command. Please review the value of 'restructuredtext.sphinxBuildPath' in Workspace Settings.";
                    let errorMessage = [
                        error.name,
                        error.message,
                        error.stack,
                        "",
                        stderr.toString()
                    ].join("\n");
                    resolve(this.showError(description, errorMessage));
                }
                if (process.platform === "win32" && stderr) {
                    var errText = stderr.toString();
                    if (errText.indexOf("Exception occurred:") > -1) {
                        let description = "Cannot run sphinx command on Windows. Please review the value of 'restructuredtext.sphinxBuildPath' in Workspace Settings.";
                        resolve(this.showError(description, errText));
                    }
                }
                fs.readFile(finalName, "utf8", (err, data) => {
                    if (err === null) {
                        let fixed = this.fixLinks(data, finalName);
                        resolve(fixed);
                    }
                    else {
                        let description = "Cannot read page '" + finalName + "'.  Please review the value of 'restructuredtext.builtDocumentationPath' in Workspace Settings.";
                        let errorMessage = [
                            err.name,
                            err.message,
                            err.stack
                        ].join("\n");
                        resolve(this.showError(description, errorMessage));
                    }
                });
            });
        });
    }
}
exports.default = RstDocumentContentProvider;
//# sourceMappingURL=rstDocumentContent.js.map