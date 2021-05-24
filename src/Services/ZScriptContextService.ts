import { ContextType } from "../BuiltIn/enums";
import ZScriptContext from "../Classes/ZScriptContext";
import * as builtInTypes from "../BuiltIn/types";
import * as vscode from "vscode";
import ZScriptError from "../Classes/ZScriptError";
import * as ZScriptErrorService from "./ZScriptErrorService";

export async function analyzeContextes(
    document: vscode.TextDocument,
    contextArray: ZScriptContext[],
    resultArray: builtInTypes.ZScriptType[]
) {
    for (const context of contextArray) {
        if (context.type === ContextType.UnknownCurly) {
            const contextStart = document.offsetAt(context.start);
            let documentStart;

            if (context.outherContext) {
                documentStart = document.offsetAt(context.outherContext.start);
            } else {
                documentStart = document.getText().lastIndexOf("}", contextStart);
            }

            const contextText = document
                .getText()
                .slice(documentStart ? documentStart + 1 : 0, contextStart)
                .trimStart();

            let contextTypeMatch = contextText.match(/\b(?:enum|struct|class)\b(?=.*?\s*?\{)/gim)?.pop();

            let contextVariable: builtInTypes.ZScriptType = {
                label:
                    contextText
                        .match(/(?:(?<=(?:enum|struct|class)\s+?)\w+|(?<=\w+?\s+?)\w+?(?=\s*?\())(?=.*?\s*?\{)/gim)
                        ?.pop() ?? "Unknown",
            };

            switch (contextTypeMatch) {
                case "enum":
                    context.type = ContextType.Enum;
                    contextVariable.type = "enum";

                    break;
                case "class":
                    (contextVariable as builtInTypes.ZScriptClass).extends =
                        contextText.match(/(?<=:\s*?)\w+?(?=(?:\s+?.+?)??\s*?{)/gim)?.pop();

                    (contextVariable as builtInTypes.ZScriptClass).replaces = contextText
                        .match(/(?<=replaces\s+?)\w+?(?=(?:\s+?.+?)??\s*?{)/gim)
                        ?.pop();

                    context.type = ContextType.Class;
                    contextVariable.type = "class";

                    break;
                case "struct":
                    context.type = ContextType.Struct;
                    contextVariable.type = "struct";
                    break;
                case undefined:
                    if (!["if", "else", "for", "while", "do", "Unknown"].includes(contextVariable.label)) {
                        context.type = ContextType.Function;
                        contextVariable.type = "function";
                    } else {
                        continue;
                    }

                    break;
            }

            contextVariable.context = context;
            resultArray.push(contextVariable);

            if (context.innerContextes.length > 0) {
                analyzeContextes(document, context.innerContextes, resultArray);
            }
        }
    }
}

export async function orderContextArray(contextArray: ZScriptContext[]) {
    for (const context of contextArray) {
        for (const otherContext of contextArray) {
            if (context !== otherContext) {
                if (otherContext.contains(context)) {
                    otherContext.innerContextes.push(context);
                    context.outherContext = otherContext;

                    break;
                }
            }
        }
    }
}

export async function findContextByPosition(
    position: vscode.Position,
    contextArray: ZScriptContext[]
): Promise<ZScriptContext | null> {
    for (const context of contextArray) {
        if (context.contains(position)) {
            if (context.innerContextes.length > 0) {
                findContextByPosition(position, context.innerContextes);
            }

            return context;
        }
    }

    return null;
}

export async function updateTextContextes(
    document: vscode.TextDocument,
    errorRangesArray: ZScriptError[],
    completionsArray: builtInTypes.ZScriptType[],
    contextesArray: ZScriptContext[]
) {
    const contextChanges: vscode.Position[][] = [[], [], []];
    const tempContextes: ZScriptContext[] = [];
    let commented = false;
    let singleLineCommented = false;

    for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
        const line: vscode.TextLine = document.lineAt(lineIndex);
        const lineText: string = line.text;

        if (singleLineCommented) {
            singleLineCommented = false;
        }

        for (let characterIndex = 0; characterIndex < lineText.length; characterIndex++) {
            const character = lineText.charAt(characterIndex);

            if (singleLineCommented) {
                continue;
            }

            let bracketType = ContextType.UnknownCurly;

            if (commented) {
                commented = character !== "*" || lineText.charAt(characterIndex + 1) !== "/";
            } else {
                switch (character) {
                    case "(":
                    case ")":
                        bracketType = ContextType.UnknownRound;

                        break;
                    case "[":
                    case "]":
                        bracketType = ContextType.UnknownSquare;

                        break;
                    case "{":
                    case "}":
                        bracketType = ContextType.UnknownCurly;

                        break;
                }

                switch (character) {
                    case "(":
                    case "[":
                    case "{":
                        contextChanges[bracketType].push(new vscode.Position(lineIndex, characterIndex + 1));

                        break;
                    case ")":
                    case "]":
                    case "}":
                        contextChanges[bracketType].push(new vscode.Position(lineIndex, characterIndex));

                        try {
                            tempContextes.push(
                                new ZScriptContext(
                                    contextChanges[bracketType].splice(contextChanges[bracketType].length - 2, 1)[0],
                                    contextChanges[bracketType].splice(contextChanges[bracketType].length - 1, 1)[0],
                                    bracketType
                                )
                            );
                        } catch (error) {
                            errorRangesArray.push(
                                new ZScriptError(
                                    new vscode.Position(lineIndex, characterIndex),
                                    new vscode.Position(lineIndex, characterIndex),
                                    `"${["{", "(", "["][bracketType]}" expected somewhere!`
                                )
                            );
                        }

                        break;
                    case "/":
                        switch (lineText.charAt(characterIndex + 1)) {
                            case "*":
                                commented = true;

                                break;
                            case "/":
                                singleLineCommented = true;

                                break;
                        }

                        break;
                }
            }
        }
    }

    orderContextArray(tempContextes);

    contextesArray.push(...tempContextes.filter((contextWithOutherContext) => !contextWithOutherContext.outherContext));

    analyzeContextes(document, contextesArray, completionsArray);
    ZScriptErrorService.tagUnclosedBrackets(contextChanges, errorRangesArray);
}
