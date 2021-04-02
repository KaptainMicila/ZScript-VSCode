"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZScriptContext_1 = require("./ZScriptContext");
const vscode = require("vscode");
class ZScriptCompletionItem extends vscode.CompletionItem {
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
    constructor(label, kind, minScope = ZScriptContext_1.default.GLOBAL_SCOPE, maxScope = ZScriptContext_1.default.GLOBAL_SCOPE) {
        super(label, kind);
        this._minScope = ZScriptContext_1.default.GLOBAL_SCOPE;
        this._maxScope = ZScriptContext_1.default.GLOBAL_SCOPE;
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
exports.default = ZScriptCompletionItem;
ZScriptCompletionItem.GLOBAL_SCOPE = null;
//# sourceMappingURL=ZScriptCompletionItem.js.map