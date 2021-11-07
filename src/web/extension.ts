import * as vscode from "vscode";
import {activate as NormalActivation} from "../extension";

export function activate(context: vscode.ExtensionContext) {
    /*
     * This activates the same things the "base" extension does.
     * If it's gonna break something, we'll think about it later.
     */
    NormalActivation(context);
}
