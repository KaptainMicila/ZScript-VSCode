"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZScriptCompletionItem = exports.ZScriptContext = void 0;
const vscode = require("vscode");
const constants = require("./constants");
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
class ZScriptCompletionItem extends vscode.CompletionItem {
    constructor(label, kind, minScope = constants.GLOBAL_SCOPE, maxScope = constants.GLOBAL_SCOPE) {
        super(label, kind);
        this._minScope = constants.GLOBAL_SCOPE;
        this._maxScope = constants.GLOBAL_SCOPE;
        this._minScope = minScope;
        this._maxScope = maxScope;
    }
    get minScope() {
        return this._minScope;
    }
    set minScope(minScope) {
        this._minScope = minScope;
    }
    get maxScope() {
        return this._maxScope;
    }
    set maxScope(maxScope) {
        this._maxScope = maxScope;
    }
}
exports.ZScriptCompletionItem = ZScriptCompletionItem;
//# sourceMappingURL=classes.js.map