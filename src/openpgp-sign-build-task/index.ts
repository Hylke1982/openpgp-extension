import tl = require('azure-pipelines-task-lib/task');
import * as fs from 'async-file';
import * as path from 'path';
import * as openpgp from 'openpgp';
import {SecureFileHelpers} from './securefiles-common/securefiles-common';
import {TaskResult} from "azure-pipelines-task-lib";

async function run() {
    try {
        const inputPassPhrase: string | undefined = tl.getInput('passPhrase', true);
        const inputFilePath: string | undefined = tl.getPathInput('filePath', true);
        const inputSigningFile: string | undefined = tl.getInput('signingFile', true);

        let cwd = tl.getInput('cwd') || tl.getVariable('System.DefaultWorkingDirectory');
        tl.cd(cwd!);

        console.log(inputPassPhrase);
        let inputSigningFilePath = await new SecureFileHelpers().downloadSecureFile(inputSigningFile!);
        let privateKeyData = await fs.readFile(inputSigningFilePath, {encoding: 'utf8'});
        const privateKey = await openpgp.key.readArmored(privateKeyData);

        try {
            let decryptSuccess = await privateKey.keys[0].decrypt(inputPassPhrase!);
        } catch (Error) {
            tl.setResult(TaskResult.Failed, 'Private key cannot be decrypted');
        }

        let fileToSignPath = path.join(cwd!, inputFilePath!);
        if (fs.exists(fileToSignPath)) {

            let data = await fs.readFile(fileToSignPath, {encoding: 'utf8', flag: 'r'});
            //;

            const signOptions: openpgp.SignOptions = {
                message: openpgp.message.fromBinary(Buffer.from(data)),
                privateKeys: privateKey.keys,
                detached: true,
            };

            const signed = await openpgp.sign(signOptions);
            console.log(signed);


        } else {
            tl.setResult(tl.TaskResult.Failed, 'File to sign cannot be found', true);
        }

    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();