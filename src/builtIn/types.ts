import { MarkdownString } from "vscode";

/**
 * This is the base type. It shouldn't be (please don't) used by itself.
 *
 * @abstract
 */
export interface ZScriptType {
    /**
     * This is the "name" of the type
     */
    label: string;

    /**
     * Some types have aliases for their name.
     * This will create additional `ZScriptCompletionItem`s
     */
    aliases?: string[];

    /**
     * This is the description given to the type.
     * It can be used alone or used it as templates for all types.
     */
    description?: MarkdownString;
}

export interface Integer extends ZScriptType {
    /**
     * The lowest value this integer type can reach.
     */
    lvalue?: string;

    /**
     * The highest value this integer can reach.
     */
    hvalue?: string;
}

export const integers: Integer[] = [
    {
        label: "int",
        lvalue: "-2,147,483,648",
        hvalue: "2,147,483,647",
        description: new MarkdownString("Range of integers from `-2,147,483,648` to `2,147,483,647`"),
    },
    {
        label: "uint",
        lvalue: "0",
        hvalue: "4,294,967,296",
        description: new MarkdownString("Range of integers from `0` to `4,294,967,296`"),
    },
    {
        label: "int16",
        lvalue: "-32,768",
        hvalue: "32,767",
        aliases: ["short"],
        description: new MarkdownString("Range of integers from `-32,768` to `32,767`"),
    },
    {
        label: "uint16",
        lvalue: "0",
        hvalue: "65,535",
        aliases: ["ushort"],
        description: new MarkdownString("Range of integers from `0` to `65,535`"),
    },
    {
        label: "int8",
        lvalue: "-128",
        hvalue: "127",
        aliases: ["sbyte"],
        description: new MarkdownString("Range of integers from `-128` to `127`"),
    },
    {
        label: "uint8",
        lvalue: "0",
        hvalue: "255",
        aliases: ["byte"],
        description: new MarkdownString("Range of integers from `0` to `255`"),
    },
];

export interface Float extends ZScriptType {}

export const floats: Float[] = [
    {
        label: "double",
        description: new MarkdownString("64-bit floating-point number."),
        aliases: ["float64"],
    },
    {
        label: "float",
        description: new MarkdownString("32-bit in structures and classes, 64-bit otherwise."),
    },
];