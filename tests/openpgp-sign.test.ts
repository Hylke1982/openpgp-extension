import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Sample task tests', function () {

    before(() => {
        //process.env.TASK_TEST_TRACE = '1'
    })

    const taskJsonPath = path.join(__dirname, '../src/openpgp-sign-build-task', 'task.json');

    it('Sign with missing pass phrase', (done) => {
        missingInput('missing-passphrase.js', 'passPhrase', done);
    });

    it('Sign with missing signing file', (done) => {
        missingInput('missing-signingfile.js', 'signingFile', done);
    });

    it('Sign with missing file to sign', (done) => {
        missingInput('missing-file-to-sign.js', 'filePath', done);
    });

    it('Sign file',(done) =>{
        let tr: ttm.MockTestRunner = createMockTestRunner('sign-file.js');
        tr.run();
        assert.strictEqual(tr.succeeded,true, 'Signing of file should succeed.');
        done();
    });

    it('Sign file invalid password',(done) =>{
        let tr: ttm.MockTestRunner = createMockTestRunner('sign-file-invalidpassword.js');
        tr.run();
        assert.strictEqual(tr.succeeded,false, 'Signing of file should succeed.');
        assert(tr.stdout.search('Private key cannot be decrypted') > 0, `Missing invalid passphrase error`);
        done();
    });

    it('File to sign not found',(done) =>{
        process.env.TASK_TEST_TRACE = '1'
        let tr: ttm.MockTestRunner = createMockTestRunner('file-to-sign-not-found.js');
        tr.run();
        assert.strictEqual(tr.succeeded,false, 'Signing of file should fail');
        assert(tr.stdout.search('File to sign cannot be found') > 0, `File to sign cannot found error faild`);

        done();
    });


    function createMockTestRunner(testFile: string) {
        let taskPath = path.join(__dirname, testFile);
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(taskPath, taskJsonPath);
        return tr;
    }

    function missingInput(testFile: string, inputName: string, done: (err?: any) => void) {
        let tr = createMockTestRunner(testFile);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'Task should not succeed');
        assert(tr.stdout.search(`Input required: ${inputName}`) > 0, `Missing ${inputName} error`);
        done();

    }
});