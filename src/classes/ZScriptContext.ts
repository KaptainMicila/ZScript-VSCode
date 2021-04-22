import * as vscode from "vscode";
import { ZScriptContextType } from "../enums/ZScriptContextType";

export default class ZScriptContext extends vscode.Range {
    public static readonly GLOBAL_SCOPE: null = null;

    private _outherContext: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE;
    private _innerContextes: Array<ZScriptContext> = [];
    private readonly _type: ZScriptContextType;

    constructor(start: vscode.Position, end: vscode.Position, type: ZScriptContextType) {
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

    public get type(): ZScriptContextType {
        return this._type;
    }
}
