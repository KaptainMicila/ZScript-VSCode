"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ZScriptError extends vscode.Range {
    /**
     * It's just a normal vscode Range with an added description, for laziness.
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
        this._description = null;
        this._description = description;
    }
    get description() {
        return this._description;
    }
}
exports.default = ZScriptError;
//# sourceMappingURL=ZScriptErrorPoint.js.map