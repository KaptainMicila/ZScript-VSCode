import * as vscode from "vscode";

export default class ZScriptContext extends vscode.Range {
    public static readonly GLOBAL_SCOPE: null = null;

    private _outherContext: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE;
    private _innerContextes: Array<ZScriptContext> = [];

    constructor(start: vscode.Position, end: vscode.Position) {
        super(start, end);
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
}
