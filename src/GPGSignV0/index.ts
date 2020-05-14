import tl = require('azure-pipelines-task-lib/task');
import * as fs from 'async-file';
import * as path from 'path';
import * as openpgp from 'openpgp';
import {SecureFileHelpers} from './securefiles-common/securefiles-common';
import {TaskResult} from "azure-pipelines-task-lib";
import {key} from "openpgp";
import KeyResult = key.KeyResult;

/**
 * Read the private key
 *
 * @param inputSigningFile
 * @param inputPassPhrase
 */
async function getPrivateKey(inputSigningFile: string | undefined, inputPassPhrase: string | undefined) {
    let inputSigningFilePath = await new SecureFileHelpers().downloadSecureFile(inputSigningFile!);
    let privateKeyData = await fs.readFile(inputSigningFilePath, {encoding: 'utf8'});
    const privateKey = await openpgp.key.readArmored(privateKeyData);

    try {
        let decryptSuccess = await privateKey.keys[0].decrypt(inputPassPhrase!);
    } catch (Error) {
        tl.setResult(TaskResult.Failed, 'Private key cannot be decrypted');
    }
    return privateKey;
}

/**
 * Sign the file
 *
 * @param fileToSignPath
 * @param privateKey
 */
async function signFile(fileToSignPath: string, privateKey: KeyResult) {
    let data = await fs.readFile(fileToSignPath, {encoding: 'utf8', flag: 'r'});

    const signOptions: openpgp.SignOptions = {
        message: openpgp.message.fromBinary(Buffer.from(data)),
        privateKeys: privateKey.keys,
        detached: true,
    };

    const signed = await openpgp.sign(signOptions);
    return signed;
}

/**
 * Step into the working directory
 */
function stepIntoWorkingDirectory() {
    let cwd = tl.getInput('cwd') || tl.getVariable('System.DefaultWorkingDirectory');
    tl.cd(cwd!);
    return cwd;
}

async function run() {
    try {
        const inputPassPhrase: string | undefined = tl.getInput('passPhrase', true);
        const inputFileToSign: string | undefined = tl.getPathInput('fileToSign', true);
        const inputSigningFile: string | undefined = tl.getInput('signingFile', true);

        let cwd = stepIntoWorkingDirectory();
        const privateKey = await getPrivateKey(inputSigningFile, inputPassPhrase);

        let fileToSignPath = path.join(cwd!, inputFileToSign!);
        let fileToSignExists = await fs.exists(fileToSignPath);
        if (fileToSignExists) {
            const signed = await signFile(fileToSignPath, privateKey);
            let fileToSignSignaturePath = path.join(cwd!, `${inputFileToSign}.asc`);
            await fs.writeTextFile(fileToSignSignaturePath, signed.signature, 'utf8');
        } else {
            tl.setResult(tl.TaskResult.Failed, 'File to sign cannot be found', true);
        }

    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();