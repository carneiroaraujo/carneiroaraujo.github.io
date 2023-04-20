/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Pygol for variable blocks.
 */
'use strict';

goog.module('Blockly.Pygol.variables');

const {NameType} = goog.require('Blockly.Names');
const {pygolGenerator: Pygol} = goog.require('Blockly.Pygol');


Pygol['variables_get'] = function(block) {
  // Variable getter.
  const code =
      Pygol.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
  return [code, Pygol.ORDER_ATOMIC];
};

Pygol['variables_set'] = function(block) {
  // Variable setter.
  const argument0 =
      Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || '0';
  const varName =
      Pygol.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
  return varName + ' = ' + argument0 + '\n';
};
