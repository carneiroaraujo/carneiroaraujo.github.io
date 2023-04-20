/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Generating Pygol for colour blocks.
 */
'use strict';
goog.module('Blockly.Pygol.colour');
const { pygolGenerator: Pygol } = goog.require('Blockly.Pygol');
Pygol['colour_picker'] = function (block) {
    // Colour picker.
    const code = Pygol.quote_(block.getFieldValue('COLOUR'));
    return [code, Pygol.ORDER_ATOMIC];
};
Pygol['colour_random'] = function (block) {
    // Generate a random colour.
    Pygol.definitions_['import_random'] = 'importe random';
    const code = '\'#%06x\' % random.randint(0, 2**24 - 1)';
    return [code, Pygol.ORDER_FUNCTION_CALL];
};
Pygol['colour_rgb'] = function (block) {
    // Compose a colour from RGB components expressed as percentages.
    const functionName = Pygol.provideFunction_('colour_rgb', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(r, g, b):
  r = round(min(100, max(0, r)) * 2.55)
  g = round(min(100, max(0, g)) * 2.55)
  b = round(min(100, max(0, b)) * 2.55)
  return '#%02x%02x%02x' % (r, g, b)
`);
    const r = Pygol.valueToCode(block, 'RED', Pygol.ORDER_NONE) || 0;
    const g = Pygol.valueToCode(block, 'GREEN', Pygol.ORDER_NONE) || 0;
    const b = Pygol.valueToCode(block, 'BLUE', Pygol.ORDER_NONE) || 0;
    const code = functionName + '(' + r + ', ' + g + ', ' + b + ')';
    return [code, Pygol.ORDER_FUNCTION_CALL];
};
Pygol['colour_blend'] = function (block) {
    // Blend two colours together.
    const functionName = Pygol.provideFunction_('colour_blend', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(colour1, colour2, ratio):
  r1, r2 = inteiro(colour1[1:3], 16), inteiro(colour2[1:3], 16)
  g1, g2 = inteiro(colour1[3:5], 16), inteiro(colour2[3:5], 16)
  b1, b2 = inteiro(colour1[5:7], 16), inteiro(colour2[5:7], 16)
  ratio = min(1, max(0, ratio))
  r = round(r1 * (1 - ratio) + r2 * ratio)
  g = round(g1 * (1 - ratio) + g2 * ratio)
  b = round(b1 * (1 - ratio) + b2 * ratio)
  return '#%02x%02x%02x' % (r, g, b)
`);
    const colour1 = Pygol.valueToCode(block, 'COLOUR1', Pygol.ORDER_NONE) || '\'#000000\'';
    const colour2 = Pygol.valueToCode(block, 'COLOUR2', Pygol.ORDER_NONE) || '\'#000000\'';
    const ratio = Pygol.valueToCode(block, 'RATIO', Pygol.ORDER_NONE) || 0;
    const code = functionName + '(' + colour1 + ', ' + colour2 + ', ' + ratio + ')';
    return [code, Pygol.ORDER_FUNCTION_CALL];
};
//# sourceMappingURL=colour.js.map