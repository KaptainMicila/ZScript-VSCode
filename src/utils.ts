/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CompletionItemKind } from "vscode";

export interface IGlobalValueDef {
  name: string;
  description?: string;
  docs?: string;
}

export interface IGlobalValue extends IGlobalValueDef {
  type: CompletionItemKind;
  children?: IGlobalValue[];
}

export const mapperFactory = (type: CompletionItemKind) => (str: string | IGlobalValueDef): IGlobalValue => typeof str === 'string' ? ({ name: str, type }) : ({ name: str.name, type, description: str.description, docs: str.docs });

export const explodeString = (type: CompletionItemKind, constants: string) => constants.split('|').map(x => ({ name: x, type }));
