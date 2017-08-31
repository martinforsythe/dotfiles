'use strict';
const utils_1 = require('./../common/utils');
const settings = require('./../common/configSettings');
const helpers_1 = require('../common/helpers');
let NamedRegexp = null;
const REGEX = '(?<line>\\d+),(?<column>\\d+),(?<type>\\w+),(?<code>\\w\\d+):(?<message>.*)\\r?(\\n|$)';
(function (LintMessageSeverity) {
    LintMessageSeverity[LintMessageSeverity["Hint"] = 0] = "Hint";
    LintMessageSeverity[LintMessageSeverity["Error"] = 1] = "Error";
    LintMessageSeverity[LintMessageSeverity["Warning"] = 2] = "Warning";
    LintMessageSeverity[LintMessageSeverity["Information"] = 3] = "Information";
})(exports.LintMessageSeverity || (exports.LintMessageSeverity = {}));
var LintMessageSeverity = exports.LintMessageSeverity;
function matchNamedRegEx(data, regex) {
    if (NamedRegexp === null) {
        NamedRegexp = require('named-js-regexp');
    }
    let compiledRegexp = NamedRegexp(regex, 'g');
    let rawMatch = compiledRegexp.exec(data);
    if (rawMatch !== null) {
        return rawMatch.groups();
    }
    return null;
}
exports.matchNamedRegEx = matchNamedRegEx;
class BaseLinter {
    constructor(id, outputChannel, workspaceRootPath) {
        this.outputChannel = outputChannel;
        this.workspaceRootPath = workspaceRootPath;
        this.Id = id;
        this.pythonSettings = settings.PythonSettings.getInstance();
    }
    run(command, args, filePath, txtDocumentLines, cwd, regEx = REGEX) {
        let outputChannel = this.outputChannel;
        let linterId = this.Id;
        return new Promise((resolve, reject) => {
            utils_1.execPythonFile(command, args, cwd, true).then(data => {
                outputChannel.append('#'.repeat(10) + 'Linting Output - ' + this.Id + '#'.repeat(10) + '\n');
                outputChannel.append(data);
                let outputLines = data.split(/\r?\n/g);
                let diagnostics = [];
                outputLines.filter((value, index) => index <= this.pythonSettings.linting.maxNumberOfProblems).forEach(line => {
                    let match = matchNamedRegEx(line, regEx);
                    if (match == null) {
                        return;
                    }
                    try {
                        match.line = Number(match.line);
                        match.column = Number(match.column);
                        let possibleWord;
                        if (!isNaN(match.column)) {
                            let sourceLine = txtDocumentLines[match.line - 1];
                            let sourceStart = sourceLine.substring(match.column - 1);
                            let endCol = txtDocumentLines[match.line - 1].length;
                            // try to get the first word from the startig position
                            let possibleProblemWords = sourceStart.match(/\w+/g);
                            if (possibleProblemWords != null && possibleProblemWords.length > 0 && sourceStart.startsWith(possibleProblemWords[0])) {
                                possibleWord = possibleProblemWords[0];
                            }
                        }
                        diagnostics.push({
                            code: match.code,
                            message: match.message,
                            column: isNaN(match.column) ? 0 : match.column,
                            line: match.line,
                            possibleWord: possibleWord,
                            type: match.type,
                            provider: this.Id
                        });
                    }
                    catch (ex) {
                        // Hmm, need to handle this later
                        // TODO:
                        let y = '';
                    }
                });
                resolve(diagnostics);
            }).catch(error => {
                this.handleError(this.Id, command, error);
                resolve([]);
            });
        });
    }
    handleError(expectedFileName, fileName, error) {
        let customError = `Linting with ${this.Id} failed.`;
        if (helpers_1.isNotInstalledError(error)) {
            // Check if we have some custom arguments such as "pylint --load-plugins pylint_django"
            // Such settings are no longer supported
            let stuffAfterFileName = fileName.substring(fileName.toUpperCase().lastIndexOf(expectedFileName) + expectedFileName.length);
            // Ok if we have a space after the file name, this means we have some arguments defined and this isn't supported
            if (stuffAfterFileName.trim().indexOf(' ') > 0) {
                customError = `Linting failed, custom arguments in the 'python.linting.${this.Id}Path' is not supported.\n` +
                    `Custom arguments to the linters can be defined in 'python.linting.${this.Id}Args' setting of settings.json.\n` +
                    'For further details, please see https://github.com/DonJayamanne/pythonVSCode/wiki/Troubleshooting-Linting#2-linting-with-xxx-failed-';
            }
            else {
                customError += `\nYou could either install the '${this.Id}' linter or turn it off in setings.json via "python.linting.${this.Id}Enabled = false".`;
            }
        }
        this.outputChannel.appendLine(`\n${customError}\n${error + ''}`);
    }
}
exports.BaseLinter = BaseLinter;
//# sourceMappingURL=baseLinter.js.map