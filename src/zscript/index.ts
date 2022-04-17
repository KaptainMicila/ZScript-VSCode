/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import * as vscode from 'vscode';
import { CompletionItem, CompletionList, CompletionItemKind } from 'vscode';
import { ACTOR_FLAGS } from '../common/ActorFlags';
import { ACTOR_METHODS } from '../common/ActorMethods';
import { actorfunctions, actorfunctions_details } from './actorfunctions';
import { actorproperties } from './actorproperties';
import GlobalValues from './GlobalValues';

export function getProviders() {
  // First-level completion
  const firstLevel = vscode.languages.registerCompletionItemProvider('zscript', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
      const completionlist: CompletionList = new CompletionList();

      for (const value of GlobalValues) {
        const item: CompletionItem = new CompletionItem(value.name, value.type);

        if (value.description) item.detail = value.description;
        if (value.docs) item.documentation = value.docs;

        completionlist.items.push(item);
      }

      return completionlist;
    }
  });

  // Second-level completion
  const secondLevel = vscode.languages.registerCompletionItemProvider('zscript', {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const completionlist: CompletionList = new CompletionList();

        const itemsWithSecondLevel = GlobalValues.filter(value => value.children && value.children.length);

        for (const itemWithSecondLevel of itemsWithSecondLevel) {
          // get all text until the `position` and check if it reads `console.`
          // and if so then complete if `log`, `warn`, and `error`
          const linePrefix = document.lineAt(position).text.substr(0, position.character);

          if (!linePrefix.toLowerCase().endsWith(itemWithSecondLevel.name.toLowerCase() + '.')) {
            continue;
          }

          if (!itemWithSecondLevel.children) throw new Error('This will never been shown');

          for (const secondLevelItem of itemWithSecondLevel.children) {
            const item = new CompletionItem(secondLevelItem.name, secondLevelItem.type);

            if (secondLevelItem.description) item.detail = secondLevelItem.description;
            if (secondLevelItem.docs) item.documentation = secondLevelItem.docs;

            completionlist.items.push(item);
          }
        }
        
        return completionlist;
      }
    },
    '.' // triggered whenever a '.' is being typed
  );

  return [firstLevel, secondLevel];
}

export default getProviders();
