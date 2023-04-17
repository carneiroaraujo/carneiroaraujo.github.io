/**
 * A dictionary of the block definitions provided by this module.
 * @type {!Object<string, !BlockDefinition>}
 */
export const blocks: {
    [x: string]: ObjectConstructor;
};
/**
 * List of block types that are loops and thus do not need warnings.
 * To add a new loop type add this to your code:
 *
 * // If using the Blockly npm package and es6 import syntax:
 * import {loops} from 'blockly/blocks';
 * loops.loopTypes.add('custom_loop');
 *
 * // Else if using Closure Compiler and goog.modules:
 * const {loopTypes} = goog.require('Blockly.libraryBlocks.loops');
 * loopTypes.add('custom_loop');
 *
 * // Else if using blockly_compressed + blockss_compressed.js in browser:
 * Blockly.libraryBlocks.loopTypes.add('custom_loop');
 *
 * @type {!Set<string>}
 */
export const loopTypes: Set<string>;
//# sourceMappingURL=loops.d.ts.map