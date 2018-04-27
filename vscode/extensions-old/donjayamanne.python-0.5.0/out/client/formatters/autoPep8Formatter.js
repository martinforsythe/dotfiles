'use strict';
const baseFormatter_1 = require('./baseFormatter');
class AutoPep8Formatter extends baseFormatter_1.BaseFormatter {
    constructor(outputChannel, pythonSettings, workspaceRootPath) {
        super('autopep8', outputChannel, pythonSettings, workspaceRootPath);
        this.outputChannel = outputChannel;
        this.pythonSettings = pythonSettings;
        this.workspaceRootPath = workspaceRootPath;
    }
    formatDocument(document, options, token, range) {
        let autopep8Path = this.pythonSettings.formatting.autopep8Path;
        let autoPep8Args = Array.isArray(this.pythonSettings.formatting.autopep8Args) ? this.pythonSettings.formatting.autopep8Args : [];
        autoPep8Args = autoPep8Args.concat(['--diff']);
        if (range && !range.isEmpty) {
            autoPep8Args = autoPep8Args.concat(['--line-range', (range.start.line + 1).toString(), (range.end.line + 1).toString()]);
        }
        return super.provideDocumentFormattingEdits(document, options, token, autopep8Path, autoPep8Args);
    }
}
exports.AutoPep8Formatter = AutoPep8Formatter;
//# sourceMappingURL=autoPep8Formatter.js.map