import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Sample task tests', function () {

    before(() => {
        process.env.TASK_TEST_TRACE = '1'
    })

    let taskJsonPath = path.join(__dirname, '../src/openpgp-sign-build-task', 'task.json');

    it('Sign with missing signing file', (done) => {
        console.log(__dirname)
        let taskPath = path.join(__dirname, 'missing-passphrase.js');
        console.log(taskPath)
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(taskPath, taskJsonPath);
        tr.run();

        assert.strictEqual(tr.succeeded, false, 'Task should not succeed');
        done();

    });
});