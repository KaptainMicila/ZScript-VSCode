"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ZScriptContext extends vscode.Range {
    constructor(start, end, type) {
        super(start, end);
        this._outherContext = ZScriptContext.GLOBAL_SCOPE;
        this._innerContextes = [];
        this._type = type;
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
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
}
exports.default = ZScriptContext;
ZScriptContext.GLOBAL_SCOPE = null;
//# sourceMappingURL=ZScriptContext.js.map