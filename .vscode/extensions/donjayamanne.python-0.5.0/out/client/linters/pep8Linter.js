'use strict';
const baseLinter = require('./baseLinter');
class Linter extends baseLinter.BaseLinter {
    constructor(outputChannel, workspaceRootPath) {
        super('pep8', outputChannel, workspaceRootPath);
    }
    isEnabled() {
        return this.pythonSettings.linting.pep8Enabled;
    }
    runLinter(filePath, txtDocumentLines) {
        if (!this.pythonSettings.linting.pep8Enabled) {
            return Promise.resolve([]);
        }
        let pep8Path = this.pythonSettings.linting.pep8Path;
        let pep8Args = Array.isArray(this.pythonSettings.linting.pep8Args) ? this.pythonSettings.linting.pep8Args : [];
        return new Promise(resolve => {
            this.run(pep8Path, pep8Args.concat(['--format=%(row)d,%(col)d,%(code)s,%(code)s:%(text)s', filePath]), filePath, txtDocumentLines, this.workspaceRootPath).then(messages => {
                // All messages in pep8 are treated as warnings for now
                messages.forEach(msg => {
                    msg.severity = baseLinter.LintMessageSeverity.Information;
                });
                resolve(messages);
            });
        });
    }
}
exports.Linter = Linter;
//# sourceMappingURL=pep8Linter.js.map