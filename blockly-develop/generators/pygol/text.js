/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Pygol for text blocks.
 */
'use strict';

goog.module('Blockly.Pygol.texts');

const stringUtils = goog.require('Blockly.utils.string');
const {NameType} = goog.require('Blockly.Names');
const {pygolGenerator: Pygol} = goog.require('Blockly.Pygol');


Pygol['text'] = function(block) {
  // Text value.
  const code = Pygol.quote_(block.getFieldValue('TEXT'));
  return [code, Pygol.ORDER_ATOMIC];
};

Pygol['text_multiline'] = function(block) {
  // Text value.
  const code = Pygol.multiline_quote_(block.getFieldValue('TEXT'));
  const order =
      code.indexOf('+') !== -1 ? Pygol.ORDER_ADDITIVE : Pygol.ORDER_ATOMIC;
  return [code, order];
};

/**
 * Regular expression to detect a single-quoted string literal.
 */
const strRegExp = /^\s*'([^']|\\')*'\s*$/;

/**
 * Enclose the provided value in 'str(...)' function.
 * Leave string literals alone.
 * @param {string} value Code evaluating to a value.
 * @return {Array<string|number>} Array containing code evaluating to a string
 *     and
 *    the order of the returned code.[string, number]
 */
const forceString = function(value) {
  if (strRegExp.test(value)) {
    return [value, Pygol.ORDER_ATOMIC];
  }
  return ['str(' + value + ')', Pygol.ORDER_FUNCTION_CALL];
};

Pygol['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  // Should we allow joining by '-' or ',' or any other characters?
  switch (block.itemCount_) {
    case 0:
      return ["''", Pygol.ORDER_ATOMIC];
    case 1: {
      const element =
          Pygol.valueToCode(block, 'ADD0', Pygol.ORDER_NONE) || "''";
      const codeAndOrder = forceString(element);
      return codeAndOrder;
    }
    case 2: {
      const element0 =
          Pygol.valueToCode(block, 'ADD0', Pygol.ORDER_NONE) || "''";
      const element1 =
          Pygol.valueToCode(block, 'ADD1', Pygol.ORDER_NONE) || "''";
      const code = forceString(element0)[0] + ' + ' + forceString(element1)[0];
      return [code, Pygol.ORDER_ADDITIVE];
    }
    default: {
      const elements = [];
      for (let i = 0; i < block.itemCount_; i++) {
        elements[i] =
            Pygol.valueToCode(block, 'ADD' + i, Pygol.ORDER_NONE) || "''";
      }
      const tempVar = Pygol.nameDB_.getDistinctName('x', NameType.VARIABLE);
      const code = '\'\'.join([str(' + tempVar + ') for ' + tempVar + ' in [' +
          elements.join(', ') + ']])';
      return [code, Pygol.ORDER_FUNCTION_CALL];
    }
  }
};

Pygol['text_append'] = function(block) {
  // Append to a variable in place.
  const varName =
      Pygol.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
  const value = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_NONE) || "''";
  return varName + ' = str(' + varName + ') + ' + forceString(value)[0] + '\n';
};

Pygol['text_length'] = function(block) {
  // Is the string null or array empty?
  const text = Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || "''";
  return ['comprimento(' + text + ')', Pygol.ORDER_FUNCTION_CALL];
};

Pygol['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  const text = Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || "''";
  const code = 'not comprimento(' + text + ')';
  return [code, Pygol.ORDER_LOGICAL_NOT];
};

Pygol['text_indexOf'] = function(block) {
  // Search the text for a substring.
  // Should we allow for non-case sensitive???
  const operator = block.getFieldValue('END') === 'FIRST' ? 'find' : 'rfind';
  const substring =
      Pygol.valueToCode(block, 'FIND', Pygol.ORDER_NONE) || "''";
  const text =
      Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_MEMBER) || "''";
  const code = text + '.' + operator + '(' + substring + ')';
  if (block.workspace.options.oneBasedIndex) {
    return [code + ' + 1', Pygol.ORDER_ADDITIVE];
  }
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['text_charAt'] = function(block) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const textOrder =
      (where === 'RANDOM') ? Pygol.ORDER_NONE : Pygol.ORDER_MEMBER;
  const text = Pygol.valueToCode(block, 'VALUE', textOrder) || "''";
  switch (where) {
    case 'FIRST': {
      const code = text + '[0]';
      return [code, Pygol.ORDER_MEMBER];
    }
    case 'LAST': {
      const code = text + '[-1]';
      return [code, Pygol.ORDER_MEMBER];
    }
    case 'FROM_START': {
      const at = Pygol.getAdjustedInt(block, 'AT');
      const code = text + '[' + at + ']';
      return [code, Pygol.ORDER_MEMBER];
    }
    case 'FROM_END': {
      const at = Pygol.getAdjustedInt(block, 'AT', 1, true);
      const code = text + '[' + at + ']';
      return [code, Pygol.ORDER_MEMBER];
    }
    case 'RANDOM': {
      Pygol.definitions_['import_random'] = 'importe random';
      const functionName = Pygol.provideFunction_('text_random_letter', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(text):
  x = inteiro(random.random() * comprimento(text))
  return text[x]
`);
      const code = functionName + '(' + text + ')';
      return [code, Pygol.ORDER_FUNCTION_CALL];
    }
  }
  throw Error('Unhandled option (text_charAt).');
};

Pygol['text_getSubstring'] = function(block) {
  // Get substring.
  const where1 = block.getFieldValue('WHERE1');
  const where2 = block.getFieldValue('WHERE2');
  const text =
      Pygol.valueToCode(block, 'STRING', Pygol.ORDER_MEMBER) || "''";
  let at1;
  switch (where1) {
    case 'FROM_START':
      at1 = Pygol.getAdjustedInt(block, 'AT1');
      if (at1 === 0) {
        at1 = '';
      }
      break;
    case 'FROM_END':
      at1 = Pygol.getAdjustedInt(block, 'AT1', 1, true);
      break;
    case 'FIRST':
      at1 = '';
      break;
    default:
      throw Error('Unhandled option (text_getSubstring)');
  }

  let at2;
  switch (where2) {
    case 'FROM_START':
      at2 = Pygol.getAdjustedInt(block, 'AT2', 1);
      break;
    case 'FROM_END':
      at2 = Pygol.getAdjustedInt(block, 'AT2', 0, true);
      // Ensure that if the result calculated is 0 that sub-sequence will
      // include all elements as expected.
      if (!stringUtils.isNumber(String(at2))) {
        Pygol.definitions_['import_sys'] = 'importe sys';
        at2 += ' or sys.maxsize';
      } else if (at2 === 0) {
        at2 = '';
      }
      break;
    case 'LAST':
      at2 = '';
      break;
    default:
      throw Error('Unhandled option (text_getSubstring)');
  }
  const code = text + '[' + at1 + ' : ' + at2 + ']';
  return [code, Pygol.ORDER_MEMBER];
};

Pygol['text_changeCase'] = function(block) {
  // Change capitalization.
  const OPERATORS = {
    'UPPERCASE': '.upper()',
    'LOWERCASE': '.lower()',
    'TITLECASE': '.title()'
  };
  const operator = OPERATORS[block.getFieldValue('CASE')];
  const text = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_MEMBER) || "''";
  const code = text + operator;
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['text_trim'] = function(block) {
  // Trim spaces.
  const OPERATORS = {
    'LEFT': '.lstrip()',
    'RIGHT': '.rstrip()',
    'BOTH': '.strip()'
  };
  const operator = OPERATORS[block.getFieldValue('MODE')];
  const text = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_MEMBER) || "''";
  const code = text + operator;
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['text_print'] = function(block) {
  // Print statement.
  const msg = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_NONE) || "''";
  return 'escreva(' + msg + ')\n';
};

Pygol['text_prompt_ext'] = function(block) {
  // Prompt function.
//   const functionName = Pygol.provideFunction_('text_prompt', `
// def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(msg):
//   try:
//     return raw_input(msg)
//   except NameError:
//     return input(msg)
// `);
  let msg;
  if (block.getField('TEXT')) {
    // Internal message.
    msg = Pygol.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    msg = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_NONE) || "''";
  }
  let code = 'leia(' + msg + ')';
  const toNumber = block.getFieldValue('TYPE') === 'NUMBER';
  if (toNumber) {
    code = 'real(' + code + ')';
  }
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['text_prompt'] = Pygol['text_prompt_ext'];

Pygol['text_count'] = function(block) {
  const text = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_MEMBER) || "''";
  const sub = Pygol.valueToCode(block, 'SUB', Pygol.ORDER_NONE) || "''";
  const code = text + '.count(' + sub + ')';
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['text_replace'] = function(block) {
  const text = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_MEMBER) || "''";
  const from = Pygol.valueToCode(block, 'FROM', Pygol.ORDER_NONE) || "''";
  const to = Pygol.valueToCode(block, 'TO', Pygol.ORDER_NONE) || "''";
  const code = text + '.replace(' + from + ', ' + to + ')';
  return [code, Pygol.ORDER_MEMBER];
};

Pygol['text_reverse'] = function(block) {
  const text = Pygol.valueToCode(block, 'TEXT', Pygol.ORDER_MEMBER) || "''";
  const code = 'string(reversed('+text+'))';
  //const code = text + '[::-1]';
  return [code, Pygol.ORDER_MEMBER];
};
// Ok