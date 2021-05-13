"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ZScriptContextChange extends vscode.Position {
    /**
     * @param line A zero-based line value.
     * @param character A zero-based character value.
     */
    constructor(line, character, type) {
        super(line, character);
        this._type = type;
    }
    get type() {
        return this._type;
    }
}
exports.default = ZScriptContextChange;
//# sourceMappingURL=ZScriptContextChange.js.map