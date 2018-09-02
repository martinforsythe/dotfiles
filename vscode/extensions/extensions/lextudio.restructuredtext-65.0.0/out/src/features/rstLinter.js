'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const lintingProvider_1 = require("./utils/lintingProvider");
const configuration_1 = require("./utils/configuration");
class RstLintingProvider {
    constructor() {
        this.languageId = 'restructuredtext';
    }
    activate(subscriptions) {
        let provider = new lintingProvider_1.LintingProvider(this);
        provider.activate(subscriptions);
    }
    loadConfiguration() {
        let section = vscode_1.workspace.getConfiguration(this.languageId);
        if (!section)
            return;
        var module = [];
        var build = configuration_1.Configuration.loadSetting('linter.executablePath', null);
        if (build == null) {
            var python = configuration_1.Configuration.loadSetting('pythonPath', null, 'python');
            if (python != null) {
                build = python;
                module = module.concat(["-m", "doc8.main"]);
            }
        }
        if (build == null) {
            build = "doc8";
        }
        return {
            executable: build,
            module: module,
            fileArgs: [],
            bufferArgs: [],
            extraArgs: section.get('linter.extraArgs'),
            runTrigger: section.get('linter.run', 'onType')
        };
    }
    process(lines) {
        let section = vscode_1.workspace.getConfiguration(this.languageId);
        let diagnostics = [];
        lines.forEach(function (line) {
            if (line.includes("No module named")) {
                diagnostics.push({
                    range: new vscode_1.Range(0, 0, 0, Number.MAX_VALUE),
                    severity: vscode_1.DiagnosticSeverity.Warning,
                    message: line,
                    code: null,
                    source: 'restructuredtext'
                });
                return;
            }
            const regex = /(.+?):([0-9]+):\s(.+)/;
            const matches = regex.exec(line);
            if (matches === null) {
                return;
            }
            let lineNumber = parseInt(matches[2]) - 1;
            diagnostics.push({
                range: new vscode_1.Range(lineNumber, 0, lineNumber, Number.MAX_VALUE),
                severity: vscode_1.DiagnosticSeverity.Warning,
                message: matches[3],
                code: null,
                source: 'restructuredtext'
            });
        });
        return diagnostics;
    }
}
exports.default = RstLintingProvider;
//# sourceMappingURL=rstLinter.js.map