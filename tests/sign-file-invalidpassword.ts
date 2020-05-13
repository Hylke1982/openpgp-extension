import * as path from "path";
import * as ttm from "azure-pipelines-task-lib/mock-run";
import ma = require('azure-pipelines-task-lib/mock-answer');


let tp = path.join(__dirname, '../build/GPGSignV0', 'index.js');
let tmr: ttm.TaskMockRunner = new ttm.TaskMockRunner(tp);

process.env["SYSTEM_DEFAULTWORKINGDIRECTORY"] = __dirname;

// Set input
tmr.setInput('passPhrase', 'INVALID')
tmr.setInput('signingFile', 'SignTestKey.pgp')
tmr.setInput('filePath', 'stubs/file-to-sign.txt')

// Mock anwsers
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    'stats': {
        'stubs/file-to-sign.txt': {
            isFile() {
                return true;
            }
        }
    }
};
tmr.setAnswers(a);

// Import Secure file helper mock
import * as SecureFileHelpers from "./securefiles-common/securefiles-common-mock";

let secureFileHelper = SecureFileHelpers;
tmr.registerMock('./securefiles-common/securefiles-common', secureFileHelper);

tmr.run();
