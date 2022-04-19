/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// Based on https://github.com/yarnpkg/berry/tree/master/packages/vscode-zipfs

import * as vscode from 'vscode';
import { basename } from 'path';

import { WadFsProvider } from './WadFsProvider';

function mount(uri: vscode.Uri) {
  const wadUri = vscode.Uri.parse(`wad:${uri.fsPath}`);

  if (typeof vscode.workspace.getWorkspaceFolder(wadUri) === 'undefined') {
    vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders!.length, 0, {
      name: basename(wadUri.fsPath),
      uri: wadUri,
    });
  }
}

function unmount(uri: vscode.Uri): void {
  const wadUri = vscode.Uri.parse(`wad:${uri.fsPath}`);

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(wadUri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage(`Cannot unmount ${wadUri.fsPath}: not mounted`);
    return;
  }

  if (!vscode.workspace.workspaceFolders)
    throw new Error(`Assertion failed: workspaceFolders is undefined`);

  // When calling `updateWorkspaceFolders`, vscode still keeps the "workspace mode" even if a single folder remains which is quite annoying.
  // Because of this, we execute `vscode.openFolder` to open the workspace folder.
  if (vscode.workspace.workspaceFolders.length === 2) {
    const otherFolder = vscode.workspace.workspaceFolders.find(folder => folder.index !== workspaceFolder.index)!;

    vscode.commands.executeCommand(`vscode.openFolder`, otherFolder.uri, { forceNewWindow: false });
  } else {
    vscode.workspace.updateWorkspaceFolders(workspaceFolder.index, 1);
  }
}

export default [
  vscode.workspace.registerFileSystemProvider(`wad`, new WadFsProvider(), {
    isCaseSensitive: false,
  }),

  vscode.commands.registerCommand(`wadfs.mountWadFile`, (uri: vscode.Uri) => {
    mount(uri);
  }),

  vscode.commands.registerCommand(`wadfs.unmountWadFile`, (uri: vscode.Uri) => {
    unmount(uri);
  }),

  vscode.commands.registerCommand(`wadfs.mountWadEditor`, () => {
    mount(vscode.window.activeTextEditor!.document.uri);
  })
] as vscode.Disposable[];
