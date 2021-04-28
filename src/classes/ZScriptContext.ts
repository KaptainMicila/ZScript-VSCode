import * as vscode from "vscode";
import ZScriptContextType from "../enums/ZScriptContextType";

export default class ZScriptContext extends vscode.Range {
    public static readonly GLOBAL_SCOPE: null = null;

    #outherContext: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE = ZScriptContext.GLOBAL_SCOPE;
    #innerContextes: Array<ZScriptContext> = [];
    readonly #type: ZScriptContextType;

    constructor(start: vscode.Position, end: vscode.Position, type: ZScriptContextType) {
        super(start, end);
        this.#type = type;
    }

    public get outherContext(): ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE {
        return this.#outherContext;
    }

    public set outherContext(context: ZScriptContext | typeof ZScriptContext.GLOBAL_SCOPE) {
        this.#outherContext = context;
    }

    public get innerContextes(): Array<ZScriptContext> {
        return this.#innerContextes;
    }

    public get type(): ZScriptContextType {
        return this.#type;
    }
}
