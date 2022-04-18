/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CompletionItemKind } from "vscode";
import { explodeString, ICompletionTree } from "../utils";
import CONSTANTS from "./constants";
import FUNCTIONS from "./functions";

const type = CompletionItemKind;

const globalValues: ICompletionTree[] = [
  // Keywords
  ...explodeString(type.Keyword, "function|enter|respawn|death|lightning|unloading|disconnect|kill|fixed|global|net|import |libdefine|library|nocompact|nowadauthor|EncryptStrings|static|wadauthor|region|endregion|reopen|BlueReturn|RedReturn|WhiteReturn|Pickup|ClientSide"),

  // Constants
  ...CONSTANTS,

  // Functions
  ...FUNCTIONS,
];

export default globalValues;