import * as path from "path";
import * as ttm from "azure-pipelines-task-lib/mock-run";

let tp = path.join(__dirname, '../build/openpgp-sign-build-task', 'index.js');
console.log(tp)
let tmr: ttm.TaskMockRunner = new ttm.TaskMockRunner(tp);
tmr.run();