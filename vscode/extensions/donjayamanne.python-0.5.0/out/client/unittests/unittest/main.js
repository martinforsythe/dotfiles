'use strict';
const configSettings_1 = require('../../common/configSettings');
const contracts_1 = require('../common/contracts');
const runner_1 = require('./runner');
const collector_1 = require('./collector');
const baseTestManager_1 = require('../common/baseTestManager');
const settings = configSettings_1.PythonSettings.getInstance();
class TestManager extends baseTestManager_1.BaseTestManager {
    constructor(rootDirectory, outputChannel) {
        super('pytest', rootDirectory, outputChannel);
    }
    discoverTestsImpl(ignoreCache) {
        let args = settings.unitTest.unittestArgs.slice(0);
        return collector_1.discoverTests(this.rootDirectory, args, this.cancellationToken);
    }
    runTestImpl(tests, testsToRun, runFailedTests) {
        let args = settings.unitTest.unittestArgs.slice(0);
        if (runFailedTests === true) {
            testsToRun = { testFile: [], testFolder: [], testSuite: [], testFunction: [] };
            testsToRun.testFunction = tests.testFunctions.filter(fn => {
                return fn.testFunction.status === contracts_1.TestStatus.Error || fn.testFunction.status === contracts_1.TestStatus.Fail;
            }).map(fn => fn.testFunction);
        }
        return runner_1.runTest(this.rootDirectory, tests, args, testsToRun, this.cancellationToken, this.outputChannel);
    }
}
exports.TestManager = TestManager;
//# sourceMappingURL=main.js.map