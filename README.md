# openpgp-extension

An Azure DevOps extension to GPG Sign a file in Azure DevOps.

## How to use in Azure DevOps

Usage within Azure DevOps

### Sign a file

```yaml
- task: GPGSign@0
  inputs:
    # Pass phrase for GPG private key
    passPhrase: $(PASSPHRASE)
    # File to sign
    fileToSign: test.txt
    # Secret file reference (GPG private key)
    signingFile: 'SignTestKey.pgp'
    # Change working directory
    # cwd: /path/to/working/directory
  env:
    PASSPHRASE: $(passphrase)
```
A file on the same location with suffix `.asc` is created after signing.

## Build

Install the following dependencies globally:

```
npm i -g typescript
npm i -g tfx-cli
npm i -g cpx
npm i -g tfx
npm i -g tfx-cli
```

## Test

```
npm run test
```