import ZScriptContext from "./ZScriptContext";
import * as vscode from "vscode";

export default class ZScriptCompletionItem extends vscode.CompletionItem {
    public static readonly GLOBAL_SCOPE: null = null;
    private _minScope: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE;
    private _maxScope: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE;

    /**
     * Creates a new completion item.
     *
     * Completion items must have at least a label (a `CompletionItem.label`) which then
     * will be used as insert text as well as for sorting and filtering.
     *
     * @param label The label of the completion.
     * @param kind The `CompletionItemKind` of the completion.
     * @param minScope The minimal scope where this completition can be.
     * @param maxScope The maximium scope where this completition can be.
     */
    constructor(
        label: string,
        kind?: vscode.CompletionItemKind,
        minScope: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE,
        maxScope: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE
    ) {
        super(label, kind);
        this._minScope = minScope;
        this._maxScope = maxScope;
    }

    public get minScope(): ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE {
        return this._minScope;
    }

    public set minScope(minScope: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE) {
        this._minScope = minScope;
    }

    public get maxScope(): ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE {
        return this._maxScope;
    }

    public set maxScope(maxScope: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE) {
        this._maxScope = maxScope;
    }
}
