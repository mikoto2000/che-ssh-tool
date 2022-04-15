#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

import WorkspaceClient, { IRemoteAPI, IRestAPIConfig } from '@eclipse-che/workspace-client';

const CHE_SSH_SERVICE_NAME = 'vcs';

program.version('1.0.2');

program
  .command('generate <keyName>')
  .description('SSH キーペア生成')
  .action((keyName: string) => generateSshKey(keyName));

program
  .command('delete <keyName>')
  .description('SSH キーペア削除')
  .action((keyName: string) => deleteSshKey(keyName));

program
  .command('list')
  .description('SSH キーペア一覧')
  .action(() => listSshKey());

program
  .command('show <keyName>')
  .description('SSH キーペア情報表示')
  .action((keyName: string) => showSshKey(keyName));

program.parse(process.argv);

/**
 * Eclipse Che Workspace Rest API client 作成
 */
function createRestClient(): IRemoteAPI {
    // ワークスペース情報取得のための REST クライアント
    const restAPIConfig: IRestAPIConfig = {};
    restAPIConfig.baseUrl = process.env.CHE_API;

    const CHE_MACHINE_TOKEN = process.env.CHE_MACHINE_TOKEN;
    if (CHE_MACHINE_TOKEN) {
        restAPIConfig.headers = {};
        restAPIConfig.headers['Authorization'] = 'Bearer ' + CHE_MACHINE_TOKEN;
    }

    return WorkspaceClient.getRestApi(restAPIConfig);
}

function generateSshKey(keyName : string): void {
    // Eclipse Che Workspace Rest API client 作成
    const restApiClient = createRestClient();

    const generatedSshkeyPromis = restApiClient.generateSshKey(CHE_SSH_SERVICE_NAME, keyName);

    generatedSshkeyPromis.then(generatedSshkey => {
        console.log(`key name: ${keyName}`);
        console.log('== publicKey ==');
        console.log(generatedSshkey.publicKey);
        console.log('=====');
    });
}

function deleteSshKey(keyName : string): void {
    // Eclipse Che Workspace Rest API client 作成
    const restApiClient = createRestClient();

    const deleteSshkeyPromis = restApiClient.deleteSshKey(CHE_SSH_SERVICE_NAME, keyName);

    deleteSshkeyPromis.then(() => {
        console.log(`deleted key: ${keyName}`);
    }).catch((error) => {
        console.log(`delete error ${keyName}: ${error}`);
    });
}

function listSshKey(): void {
    // Eclipse Che Workspace Rest API client 作成
    const restApiClient = createRestClient();

    const vcsServicesPromis = restApiClient.getAllSshKey(CHE_SSH_SERVICE_NAME);

    vcsServicesPromis.then(vcsServices => {
        vcsServices.forEach(vcsService => {
            console.log(vcsService.name);
        });
    });
}

function showSshKey(keyName: string): void {
    // Eclipse Che Workspace Rest API client 作成
    const restApiClient = createRestClient();

    const vcsServicePromis = restApiClient.getSshKey(CHE_SSH_SERVICE_NAME, keyName);

    vcsServicePromis.then(vcsService => {
        console.log("public key: " + vcsService.publicKey);
    });
}

/**
 * null/undefined を殺すための関数。
 */
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg);
  }
}

/**
 * assert 関数の condition が null/undefined だった場合に送出されるエラー。
 */
class AssertionError extends Error {
}
