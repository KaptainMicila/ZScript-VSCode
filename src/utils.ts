/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CompletionItem, CompletionItemKind, CompletionList } from "vscode";
import * as vscode from 'vscode';

export interface ICompletionTreeDef {
  name: string;
  description?: string;
  docs?: string;
  insertText?: string;
}

export interface ICompletionTree extends ICompletionTreeDef {
  type: CompletionItemKind;
  children?: ICompletionTree[];
}

export const mapperFactory = (type: CompletionItemKind) => (str: string | ICompletionTreeDef): ICompletionTree => typeof str === 'string' ? ({ name: str, type }) : ({ name: str.name, type, description: str.description, docs: str.docs });

export const explodeString = (type: CompletionItemKind, constants: string) => constants.split('|').map(x => ({ name: x, type }));

export function toLowerIfNeeded(str: string, caseSensitive = false) {
  return caseSensitive ? str : str.toLowerCase();
}

export function getItemByPath(pathTokens: string[], values: ICompletionTree[], caseSensitive = false) {
  console.log('getItemByPath', pathTokens, values);
  let token: string;
  let currentItem: ICompletionTree | undefined = { name: '', children: values, type: vscode.CompletionItemKind.Constant };

  while (token = pathTokens.shift() as string) {
    console.log('iteration', token, currentItem);
    if (!currentItem?.children?.length) return console.log('Not found');

    currentItem = currentItem.children.find(item => toLowerIfNeeded(item.name, caseSensitive) === toLowerIfNeeded(token, caseSensitive));
  }

  console.log('Found', currentItem);

  return currentItem;
}

export function generateProviderByCompletionTree(selector: vscode.DocumentSelector, tree: ICompletionTree[], caseSensitive = false) {
  return [vscode.languages.registerCompletionItemProvider(
    selector,
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const completionlist: CompletionList = new CompletionList();

        // get all text until the `position` and check if it reads `console.`
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const currentConstruct = linePrefix.split(/\s+/).pop();

        if (!currentConstruct) return;

        const tokens = currentConstruct.replace(/[{}\[\](),/\\]/g, '').split('.');

        tokens.pop(); // Remove last empty ("something.") token

        const currentItem = getItemByPath(tokens, tree, caseSensitive);

        if (!currentItem || !currentItem.children?.length) return;

        for (const child of currentItem.children) {
          const item = new CompletionItem(child.name, child.type);

          if (child.description) item.detail = child.description;
          if (child.docs) item.documentation = child.docs;
          if (child.insertText) item.insertText = new vscode.SnippetString(child.insertText);

          completionlist.items.push(item);
        }

        return completionlist;
      }
    },
    '.', // also triggered whenever a '.' is being typed
  ),
  vscode.languages.registerHoverProvider(selector, {
    provideHover(document, position) {
      const wordRange = document.getWordRangeAtPosition(position);
      const word = document.getText(wordRange);

      const item = tree.find(x => x.name === word);

      if (!item) return;

      return new vscode.Hover('`' + (item.description || item.docs || item.name) + '`');
    }
  })
  ];
}
