"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ZScriptContext extends vscode.Range {
    constructor(start, end) {
        super(start, end);
        this._outherContext = ZScriptContext.GLOBAL_SCOPE;
        this._innerContextes = [];
    }
    get outherContext() {
        return this._outherContext;
    }
    set outherContext(context) {
        this._outherContext = context;
    }
    get innerContextes() {
        return this._innerContextes;
    }
}
exports.default = ZScriptContext;
ZScriptContext.GLOBAL_SCOPE = null;
//# sourceMappingURL=ZScriptContext.js.map