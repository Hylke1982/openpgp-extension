import * as path from "path";
import * as ttm from "azure-pipelines-task-lib/mock-run";
import ma = require('azure-pipelines-task-lib/mock-answer');


let tp = path.join(__dirname, '../build/GPGSignV0', 'index.js');
let tmr: ttm.TaskMockRunner = new ttm.TaskMockRunner(tp);

process.env["SYSTEM_DEFAULTWORKINGDIRECTORY"] = __dirname;

// Set input
tmr.setInput('passPhrase', 'Test001!')
tmr.setInput('signingFile', 'SignTestKey.pgp')
tmr.setInput('fileToSign', 'stubs/file-to-sign-not-found.txt')

// Import Secure file helper mock
import * as SecureFileHelpers from "./securefiles-common/securefiles-common-mock";

let secureFileHelper = SecureFileHelpers;
tmr.registerMock('./securefiles-common/securefiles-common', secureFileHelper);

tmr.run();
