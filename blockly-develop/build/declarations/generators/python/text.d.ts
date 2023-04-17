declare const stringUtils: any;
declare const NameType: any;
declare const Python: any;
/**
 * Regular expression to detect a single-quoted string literal.
 */
declare const strRegExp: RegExp;
/**
 * Enclose the provided value in 'str(...)' function.
 * Leave string literals alone.
 * @param {string} value Code evaluating to a value.
 * @return {Array<string|number>} Array containing code evaluating to a string
 *     and
 *    the order of the returned code.[string, number]
 */
declare function forceString(value: string): Array<string | number>;
//# sourceMappingURL=text.d.ts.map