"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _outherContext, _innerContextes, _type;
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ZScriptContext extends vscode.Range {
    constructor(start, end, type) {
        super(start, end);
        _outherContext.set(this, ZScriptContext.GLOBAL_SCOPE);
        _innerContextes.set(this, []);
        _type.set(this, void 0);
        __classPrivateFieldSet(this, _type, type);
    }
    get outherContext() {
        return __classPrivateFieldGet(this, _outherContext);
    }
    set outherContext(context) {
        __classPrivateFieldSet(this, _outherContext, context);
    }
    get innerContextes() {
        return __classPrivateFieldGet(this, _innerContextes);
    }
    get type() {
        return __classPrivateFieldGet(this, _type);
    }
}
exports.default = ZScriptContext;
_outherContext = new WeakMap(), _innerContextes = new WeakMap(), _type = new WeakMap();
ZScriptContext.GLOBAL_SCOPE = null;
//# sourceMappingURL=ZScriptContext.js.map