import tl = require('azure-pipelines-task-lib/task');

async function run() {
    try {
        const inputPassPhrase : string | undefined = tl.getInput('passPhrase', true);
        const passPhraseString : string | undefined = tl.getInput('passPhrase', true);

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();