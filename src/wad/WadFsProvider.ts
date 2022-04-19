/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import * as vscode from 'vscode';
import { WadParser } from './WadParser';
import { extname } from 'path';

export class WadFsProvider implements vscode.FileSystemProvider {
  private readonly fs = [
    "Test",
    "Test2",
    "Test3",
  ];

  private wad: WadParser | null = null;

  stat(uri: vscode.Uri): vscode.FileStat {
    console.log('stat', uri.fsPath, extname(uri.fsPath).toLowerCase());
    if (extname(uri.fsPath).toLowerCase() === 'wad') return {
      ctime: Date.now(),
      mtime: Date.now(),
      size: 100,
      type: vscode.FileType.Directory
    };

    return {
      ctime: Date.now(),
      mtime: Date.now(),
      size: 100,
      type: vscode.FileType.File,
      permissions: vscode.FilePermission.Readonly
    };
    // return this.wad.fileStat(uri.fsPath);
  }

  readDirectory(uri: vscode.Uri): Array<[string, vscode.FileType]> {
    console.log('readDirectory', uri.fsPath);
    return this.fs.map(name => [name, vscode.FileType.File]);
    throw new Error('Not implemented');
  }

  readFile(uri: vscode.Uri) {
    console.log('readDirectory', uri.fsPath);
    return Buffer.from("Hello!");
  }

  writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): void {
    throw new Error('Not implemented');
    console.log(Buffer.from(content));
  }

  rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {
    throw new Error(`Not implemented`);
  }

  delete(uri: vscode.Uri, options: { recursive: boolean }): void {
    throw new Error('Not implemented');
  }

  createDirectory(uri: vscode.Uri): void {
    throw new Error('Not supported');
  }

  private _emitter = new vscode.EventEmitter<Array<vscode.FileChangeEvent>>();
  readonly onDidChangeFile = this._emitter.event;

  watch(resource: vscode.Uri, opts: any): vscode.Disposable {
    return new vscode.Disposable(() => { });
  }
}
