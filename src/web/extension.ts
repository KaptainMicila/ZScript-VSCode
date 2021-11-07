import * as vscode from "vscode";
import { activate as normalActivation } from "../extension";

export function activate(context: vscode.ExtensionContext) {
    /*
     * This activates the same things the "base" extension does.
     * If it's gonna break something, we'll think about it later.
     */
    normalActivation(context);
}
