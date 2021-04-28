"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floats = exports.integers = void 0;
const vscode_1 = require("vscode");
exports.integers = [
    {
        label: "int",
        lvalue: "-2,147,483,648",
        hvalue: "2,147,483,647",
        description: new vscode_1.MarkdownString("Range of integers from `-2,147,483,648` to `2,147,483,647`"),
    },
    {
        label: "uint",
        lvalue: "0",
        hvalue: "4,294,967,296",
        description: new vscode_1.MarkdownString("Range of integers from `0` to `4,294,967,296`"),
    },
    {
        label: "int16",
        lvalue: "-32,768",
        hvalue: "32,767",
        aliases: ["short"],
        description: new vscode_1.MarkdownString("Range of integers from `-32,768` to `32,767`"),
    },
    {
        label: "uint16",
        lvalue: "0",
        hvalue: "65,535",
        aliases: ["ushort"],
        description: new vscode_1.MarkdownString("Range of integers from `0` to `65,535`"),
    },
    {
        label: "int8",
        lvalue: "-128",
        hvalue: "127",
        aliases: ["sbyte"],
        description: new vscode_1.MarkdownString("Range of integers from `-128` to `127`"),
    },
    {
        label: "uint8",
        lvalue: "0",
        hvalue: "255",
        aliases: ["byte"],
        description: new vscode_1.MarkdownString("Range of integers from `0` to `255`"),
    },
];
exports.floats = [
    {
        label: "double",
        description: new vscode_1.MarkdownString("64-bit floating-point number."),
        aliases: ["float64"],
    },
    {
        label: "float",
        description: new vscode_1.MarkdownString("32-bit in structures and classes, 64-bit otherwise."),
    },
];
//# sourceMappingURL=types.js.map