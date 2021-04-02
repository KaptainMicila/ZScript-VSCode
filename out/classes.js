"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZScriptContext = void 0;
const vscode = require("vscode");
class ZScriptContext extends vscode.Range {
    constructor(start, end) {
        super(start, end);
        this._outherContext = null;
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
exports.ZScriptContext = ZScriptContext;
//# sourceMappingURL=classes.js.map