'use strict';
const baseLinter = require('./baseLinter');
const REGEX = '(?<file>.py):(?<line>\\d+): (?<type>\\w+): (?<message>.*)\\r?(\\n|$)';
class Linter extends baseLinter.BaseLinter {
    constructor(outputChannel, workspaceRootPath) {
        super('mypy', outputChannel, workspaceRootPath);
    }
    parseMessagesSeverity(category) {
        switch (category) {
            case 'error': {
                return baseLinter.LintMessageSeverity.Error;
            }
            case 'note': {
                return baseLinter.LintMessageSeverity.Hint;
            }
            default: {
                return baseLinter.LintMessageSeverity.Information;
            }
        }
    }
    isEnabled() {
        return this.pythonSettings.linting.mypyEnabled;
    }
    runLinter(filePath, txtDocumentLines) {
        if (!this.pythonSettings.linting.mypyEnabled) {
            return Promise.resolve([]);
        }
        let mypyPath = this.pythonSettings.linting.mypyPath;
        let mypyArgs = Array.isArray(this.pythonSettings.linting.mypyArgs) ? this.pythonSettings.linting.mypyArgs : [];
        return new Promise((resolve, reject) => {
            this.run(mypyPath, mypyArgs.concat([filePath]), filePath, txtDocumentLines, this.workspaceRootPath, REGEX).then(messages => {
                messages.forEach(msg => {
                    msg.severity = this.parseMessagesSeverity(msg.type);
                    msg.code = msg.type;
                });
                resolve(messages);
            }, reject);
        });
    }
}
exports.Linter = Linter;
//# sourceMappingURL=mypy.js.map