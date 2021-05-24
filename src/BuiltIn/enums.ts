/* eslint-disable no-unused-vars */
export enum AccessModifiers {
    PUBLIC = "public",
    PRIVATE = "private",
    PROTECTED = "protected",
}

export enum ContextType {
    UnknownCurly,
    UnknownRound,
    UnknownSquare,
    Enum,
    Struct,
    Class,
    Function,
    Condition,
}
