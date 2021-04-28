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
var _description;
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ZScriptError extends vscode.Range {
    /**
     * It's just a normal vscode Range with an added description, for extra laziness.
     *
     * Create a new range from two positions. If `start` is not
     * before or equal to `end`, the values will be swapped.
     *
     * @param start A position.
     * @param end A position.
     * @param description The description of the problem.
     */
    constructor(start, end, description) {
        super(start, end);
        _description.set(this, null);
        __classPrivateFieldSet(this, _description, description);
    }
    get description() {
        return __classPrivateFieldGet(this, _description);
    }
}
exports.default = ZScriptError;
_description = new WeakMap();
//# sourceMappingURL=ZScriptError.js.map