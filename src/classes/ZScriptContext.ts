import * as vscode from "vscode";
import { ContextType } from "../BuiltIn/enums";

export default class ZScriptContext extends vscode.Range {
    public static readonly GLOBAL_SCOPE: null = null;

    private _outherContext: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE;
    private _innerContextes: Array<ZScriptContext> = [];
    private _type: ContextType;

    constructor(start: vscode.Position, end: vscode.Position, type: ContextType) {
        super(start, end);
        this._type = type;
    }

    public get outherContext(): ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE {
        return this._outherContext;
    }

    public set outherContext(context: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE) {
        this._outherContext = context;
    }

    public get innerContextes(): Array<ZScriptContext> {
        return this._innerContextes;
    }

    public get type(): ContextType {
        return this._type;
    }

    public set type(type: ContextType) {
        this._type = type;
    }
}
