declare const NameType: any;
declare const Lua: any;
/**
 * Returns an expression calculating the index into a list.
 * @param {string} listName Name of the list, used to calculate length.
 * @param {string} where The method of indexing, selected by dropdown in Blockly
 * @param {string=} opt_at The optional offset when indexing from start/end.
 * @return {string|undefined} Index expression.
 */
declare function getListIndex(listName: string, where: string, opt_at?: string | undefined): string | undefined;
//# sourceMappingURL=lists.d.ts.map