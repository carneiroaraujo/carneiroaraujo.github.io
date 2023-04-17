declare const NameType: any;
declare const JavaScript: any;
/**
 * Regular expression to detect a single-quoted string literal.
 */
declare const strRegExp: RegExp;
/**
 * Enclose the provided value in 'String(...)' function.
 * Leave string literals alone.
 * @param {string} value Code evaluating to a value.
 * @return {Array<string|number>} Array containing code evaluating to a string
 *     and the order of the returned code.[string, number]
 */
declare function forceString(value: string): Array<string | number>;
/**
 * Returns an expression calculating the index into a string.
 * @param {string} stringName Name of the string, used to calculate length.
 * @param {string} where The method of indexing, selected by dropdown in Blockly
 * @param {string=} opt_at The optional offset when indexing from start/end.
 * @return {string|undefined} Index expression.
 */
declare function getSubstringIndex(stringName: string, where: string, opt_at?: string | undefined): string | undefined;
//# sourceMappingURL=text.d.ts.map