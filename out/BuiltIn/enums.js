"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextType = exports.AccessModifiers = void 0;
/* eslint-disable no-unused-vars */
var AccessModifiers;
(function (AccessModifiers) {
    AccessModifiers["PUBLIC"] = "public";
    AccessModifiers["PRIVATE"] = "private";
    AccessModifiers["PROTECTED"] = "protected";
})(AccessModifiers = exports.AccessModifiers || (exports.AccessModifiers = {}));
var ContextType;
(function (ContextType) {
    ContextType[ContextType["UnknownCurly"] = 0] = "UnknownCurly";
    ContextType[ContextType["UnknownRound"] = 1] = "UnknownRound";
    ContextType[ContextType["UnknownSquare"] = 2] = "UnknownSquare";
    ContextType[ContextType["Enum"] = 3] = "Enum";
    ContextType[ContextType["Struct"] = 4] = "Struct";
    ContextType[ContextType["Class"] = 5] = "Class";
    ContextType[ContextType["Function"] = 6] = "Function";
    ContextType[ContextType["Condition"] = 7] = "Condition";
})(ContextType = exports.ContextType || (exports.ContextType = {}));
//# sourceMappingURL=enums.js.map