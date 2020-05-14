import * as path from "path";
import * as ttm from "azure-pipelines-task-lib/mock-run";

let tp = path.join(__dirname, '../build/GPGSignV0', 'index.js');
console.log(tp)
let tmr: ttm.TaskMockRunner = new ttm.TaskMockRunner(tp);

// Set variables
tmr.setVariableName('System.DefaultWorkingDirectory', __dirname);

tmr.setInput('passPhrase','passphrase')
tmr.setInput('fileToSign','file-to-sign.txt')
tmr.run();