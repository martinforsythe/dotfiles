'use strict';
const vscode = require('vscode');
const contracts_1 = require('../common/contracts');
const configSettings_1 = require('../../common/configSettings');
const constants = require('../../common/constants');
const testUtils_1 = require('../common/testUtils');
const settings = configSettings_1.PythonSettings.getInstance();
class TestResultDisplay {
    constructor(outputChannel) {
        this.outputChannel = outputChannel;
        this.discoverCounter = 0;
        this.ticker = ['|', '/', '-', '|', '/', '-', '\\'];
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    }
    dispose() {
        this.statusBar.dispose();
    }
    set enabled(enable) {
        if (enable) {
            this.statusBar.show();
        }
        else {
            this.statusBar.hide();
        }
    }
    DisplayProgressStatus(tests) {
        this.displayProgress('Running Tests', `Running Tests (Click to Stop)`, constants.Commands.Tests_Ask_To_Stop_Test);
        tests
            .then(this.updateTestRunWithSuccess.bind(this))
            .catch(this.updateTestRunWithFailure.bind(this))
            .catch(() => { });
    }
    updateTestRunWithSuccess(tests) {
        this.clearProgressTicker();
        // Treat errors as a special case, as we generally wouldn't have any errors
        const statusText = [];
        const toolTip = [];
        let foreColor = '';
        if (tests.summary.passed > 0) {
            statusText.push(`${constants.Octicons.Test_Pass} ${tests.summary.passed}`);
            toolTip.push(`${tests.summary.passed} Passed`);
            foreColor = '#66ff66';
        }
        if (tests.summary.skipped > 0) {
            statusText.push(`${constants.Octicons.Test_Skip} ${tests.summary.skipped}`);
            toolTip.push(`${tests.summary.skipped} Skipped`);
            foreColor = '#66ff66';
        }
        if (tests.summary.failures > 0) {
            statusText.push(`${constants.Octicons.Test_Fail} ${tests.summary.failures}`);
            toolTip.push(`${tests.summary.failures} Failed`);
            foreColor = 'yellow';
        }
        if (tests.summary.errors > 0) {
            statusText.push(`${constants.Octicons.Test_Error} ${tests.summary.errors}`);
            toolTip.push(`${tests.summary.errors} Error${tests.summary.errors > 1 ? 's' : ''}`);
            foreColor = 'yellow';
        }
        this.statusBar.tooltip = toolTip.length === 0 ? 'No Tests Ran' : toolTip.join(', ') + ' (Tests)';
        this.statusBar.text = statusText.length === 0 ? 'No Tests Ran' : statusText.join(' ');
        this.statusBar.color = foreColor;
        this.statusBar.command = constants.Commands.Tests_View_UI;
        return tests;
    }
    updateTestRunWithFailure(reason) {
        this.clearProgressTicker();
        this.statusBar.command = constants.Commands.Tests_View_UI;
        if (reason === contracts_1.CANCELLATION_REASON) {
            this.statusBar.text = '$(zap) Run Tests';
            this.statusBar.tooltip = 'Run Tests';
        }
        else {
            this.statusBar.text = `$(octicon-alert) Tests Failed`;
            this.statusBar.tooltip = 'Running Tests Failed';
            testUtils_1.displayTestErrorMessage('There was an error in running the tests.');
        }
        return Promise.reject(reason);
    }
    displayProgress(message, tooltip, command) {
        this.progressPrefix = this.statusBar.text = '$(stop) ' + message;
        this.statusBar.command = command;
        this.statusBar.tooltip = tooltip;
        this.statusBar.show();
        this.clearProgressTicker();
        this.progressTimeout = setInterval(() => this.updateProgressTicker(), 150);
    }
    updateProgressTicker() {
        let text = `${this.progressPrefix} ${this.ticker[this.discoverCounter % 7]}`;
        this.discoverCounter += 1;
        this.statusBar.text = text;
    }
    clearProgressTicker() {
        if (this.progressTimeout) {
            clearInterval(this.progressTimeout);
        }
        this.progressTimeout = null;
        this.discoverCounter = 0;
    }
    DisplayDiscoverStatus(tests, quietMode = false) {
        this.displayProgress('Discovering Tests', 'Discovering Tests (Click to Stop)', constants.Commands.Tests_Ask_To_Stop_Discovery);
        return tests.then(tests => {
            this.updateWithDiscoverSuccess(tests);
            return tests;
        }).catch(reason => {
            this.updateWithDiscoverFailure(reason, quietMode);
            return Promise.reject(reason);
        });
    }
    updateWithDiscoverSuccess(tests) {
        this.clearProgressTicker();
        const haveTests = tests && (tests.testFunctions.length > 0);
        this.statusBar.text = haveTests ? '$(zap) Run Tests' : 'No Tests';
        this.statusBar.tooltip = haveTests ? 'Run Tests' : 'No Tests discovered';
        this.statusBar.command = haveTests ? constants.Commands.Tests_View_UI : constants.Commands.Tests_Discover;
        this.statusBar.show();
    }
    updateWithDiscoverFailure(reason, quietMode = false) {
        this.clearProgressTicker();
        this.statusBar.text = `$(zap) Discover Tests`;
        this.statusBar.tooltip = 'Discover Tests';
        this.statusBar.command = constants.Commands.Tests_Discover;
        this.statusBar.show();
        if (reason !== contracts_1.CANCELLATION_REASON && !quietMode) {
            vscode.window.showErrorMessage('There was an error in discovering tests');
        }
    }
}
exports.TestResultDisplay = TestResultDisplay;
//# sourceMappingURL=main.js.map