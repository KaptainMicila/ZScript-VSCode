import * as vscode from "vscode";

export default class ZScriptError extends vscode.Range {
    readonly #description: string | null = null;

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
    constructor(start: vscode.Position, end: vscode.Position, description: string | null) {
        super(start, end);
        this.#description = description;
    }

    public get description() {
        return this.#description;
    }
}
