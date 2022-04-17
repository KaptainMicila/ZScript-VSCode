/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import * as vscode from 'vscode';
import { CompletionItem, CompletionList } from 'vscode';
import { IGlobalValue } from '../utils';
import GlobalValues from './GlobalValues';

function getItemByPath(pathTokens: string[], values: IGlobalValue[]) {
  console.log('getItemByPath', pathTokens, GlobalValues);
  let token: string;
  let currentItem: IGlobalValue | undefined = { name: '', children: values, type: vscode.CompletionItemKind.Constant };
  
  while (token = pathTokens.shift() as string) {
    console.log('iteration', token, currentItem);
    if (!currentItem?.children?.length) return console.log('Not found');

    currentItem = currentItem.children.find(item => item.name.toLowerCase() === token.toLowerCase());
  }

  console.log('Found', currentItem);

  return currentItem;
}

export function getProviders() {
  const completion = vscode.languages.registerCompletionItemProvider('zscript', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
      const completionlist: CompletionList = new CompletionList();

      const itemsWithSecondLevel = GlobalValues.filter(value => value.children && value.children.length);

      // get all text until the `position` and check if it reads `console.`
      // and if so then complete if `log`, `warn`, and `error`
      const linePrefix = document.lineAt(position).text.substr(0, position.character);
      const currentConstruct = linePrefix.split(/\s+/).pop();

      if (!currentConstruct) return;

      const tokens = currentConstruct.replace(/[{}\[\](),/\\]/g, '').split('.');

      tokens.pop(); // Remove last empty ("something.") token

      const currentItem = getItemByPath(tokens, GlobalValues);

      if (!currentItem || !currentItem.children?.length) return;

      for (const child of currentItem.children) {
        const item = new CompletionItem(child.name, child.type);

        if (child.description) item.detail = child.description;
        if (child.docs) item.documentation = child.docs;

        completionlist.items.push(item);
      }

      return completionlist;
    }
  },
    '.' // triggered whenever a '.' is being typed
  );

  return [completion];
}

export default getProviders();
