/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Pygol for list blocks.
 */
'use strict';

goog.module('Blockly.Pygol.lists');

const stringUtils = goog.require('Blockly.utils.string');
const {NameType} = goog.require('Blockly.Names');
const {pygolGenerator: Pygol} = goog.require('Blockly.Pygol');


Pygol['lists_create_empty'] = function(block) {
  // Create an empty list.
  return ['[]', Pygol.ORDER_ATOMIC];
};

Pygol['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.itemCount_);
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] =
        Pygol.valueToCode(block, 'ADD' + i, Pygol.ORDER_NONE) || 'nulo';
  }
  const code = '[' + elements.join(', ') + ']';
  return [code, Pygol.ORDER_ATOMIC];
};

Pygol['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  const item = Pygol.valueToCode(block, 'ITEM', Pygol.ORDER_NONE) || 'nulo';
  const times =
      Pygol.valueToCode(block, 'NUM', Pygol.ORDER_MULTIPLICATIVE) || '0';
  const code = '[' + item + '] * ' + times;
  return [code, Pygol.ORDER_MULTIPLICATIVE];
};

Pygol['lists_length'] = function(block) {
  // String or array length.
  const list = Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || '[]';
  return ['comprimento(' + list + ')', Pygol.ORDER_FUNCTION_CALL];
};

Pygol['lists_isEmpty'] = function(block) {
  // Is the string null or array empty?
  const list = Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || '[]';
  const code = 'comprimento(' + list + ') == 0';
  return [code, Pygol.ORDER_LOGICAL_NOT];
};

Pygol['lists_indexOf'] = function(block) {
  // Find an item in the list.
  const item = Pygol.valueToCode(block, 'FIND', Pygol.ORDER_NONE) || '[]';
  const list = Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || "''";
  let errorIndex = ' -1';
  let firstIndexAdjustment = '';
  let lastIndexAdjustment = ' - 1';

  if (block.workspace.options.oneBasedIndex) {
    errorIndex = ' 0';
    firstIndexAdjustment = ' + 1';
    lastIndexAdjustment = '';
  }

  let functionName;
  if (block.getFieldValue('END') === 'FIRST') {
    functionName = Pygol.provideFunction_('first_index', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(my_list, elem):
  try: index = my_list.index(elem)${firstIndexAdjustment}
  except: index =${errorIndex}
  return index
`);
  } else {
    functionName = Pygol.provideFunction_('last_index', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(my_list, elem):
  try: index = len(my_list) - my_list[::-1].index(elem)${lastIndexAdjustment}
  except: index =${errorIndex}
  return index
`);
  }
  const code = functionName + '(' + list + ', ' + item + ')';
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['lists_getIndex'] = function(block) {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  const mode = block.getFieldValue('MODE') || 'GET';
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const listOrder =
      (where === 'RANDOM') ? Pygol.ORDER_NONE : Pygol.ORDER_MEMBER;
  const list = Pygol.valueToCode(block, 'VALUE', listOrder) || '[]';

  switch (where) {
    case 'FIRST':
      if (mode === 'GET') {
        const code = list + '[0]';
        return [code, Pygol.ORDER_MEMBER];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.pop(0)';
        return [code, Pygol.ORDER_FUNCTION_CALL];
      } else if (mode === 'REMOVE') {
        return list + '.pop(0)\n';
      }
      break;
    case 'LAST':
      if (mode === 'GET') {
        const code = list + '[-1]';
        return [code, Pygol.ORDER_MEMBER];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.pop()';
        return [code, Pygol.ORDER_FUNCTION_CALL];
      } else if (mode === 'REMOVE') {
        return list + '.pop()\n';
      }
      break;
    case 'FROM_START': {
      const at = Pygol.getAdjustedInt(block, 'AT');
      if (mode === 'GET') {
        const code = list + '[' + at + ']';
        return [code, Pygol.ORDER_MEMBER];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.pop(' + at + ')';
        return [code, Pygol.ORDER_FUNCTION_CALL];
      } else if (mode === 'REMOVE') {
        return list + '.pop(' + at + ')\n';
      }
      break;
    }
    case 'FROM_END': {
      const at = Pygol.getAdjustedInt(block, 'AT', 1, true);
      if (mode === 'GET') {
        const code = list + '[' + at + ']';
        return [code, Pygol.ORDER_MEMBER];
      } else if (mode === 'GET_REMOVE') {
        const code = list + '.pop(' + at + ')';
        return [code, Pygol.ORDER_FUNCTION_CALL];
      } else if (mode === 'REMOVE') {
        return list + '.pop(' + at + ')\n';
      }
      break;
    }
    case 'RANDOM':
      Pygol.definitions_['import_random'] = 'import random';
      if (mode === 'GET') {
        const code = 'random.choice(' + list + ')';
        return [code, Pygol.ORDER_FUNCTION_CALL];
      } else {
        const functionName =
            Pygol.provideFunction_('lists_remove_random_item', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(myList):
  x = int(random.random() * len(myList))
  return myList.pop(x)
`);
        const code = functionName + '(' + list + ')';
        if (mode === 'GET_REMOVE') {
          return [code, Pygol.ORDER_FUNCTION_CALL];
        } else if (mode === 'REMOVE') {
          return code + '\n';
        }
      }
      break;
  }
  throw Error('Unhandled combination (lists_getIndex).');
};

Pygol['lists_setIndex'] = function(block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  let list = Pygol.valueToCode(block, 'LIST', Pygol.ORDER_MEMBER) || '[]';
  const mode = block.getFieldValue('MODE') || 'GET';
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const value = Pygol.valueToCode(block, 'TO', Pygol.ORDER_NONE) || 'None';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    const listVar =
        Pygol.nameDB_.getDistinctName('tmp_list', NameType.VARIABLE);
    const code = listVar + ' = ' + list + '\n';
    list = listVar;
    return code;
  }

  switch (where) {
    case 'FIRST':
      if (mode === 'SET') {
        return list + '[0] = ' + value + '\n';
      } else if (mode === 'INSERT') {
        return list + '.insert(0, ' + value + ')\n';
      }
      break;
    case 'LAST':
      if (mode === 'SET') {
        return list + '[-1] = ' + value + '\n';
      } else if (mode === 'INSERT') {
        return list + '.append(' + value + ')\n';
      }
      break;
    case 'FROM_START': {
      const at = Pygol.getAdjustedInt(block, 'AT');
      if (mode === 'SET') {
        return list + '[' + at + '] = ' + value + '\n';
      } else if (mode === 'INSERT') {
        return list + '.insert(' + at + ', ' + value + ')\n';
      }
      break;
    }
    case 'FROM_END': {
      const at = Pygol.getAdjustedInt(block, 'AT', 1, true);
      if (mode === 'SET') {
        return list + '[' + at + '] = ' + value + '\n';
      } else if (mode === 'INSERT') {
        return list + '.insert(' + at + ', ' + value + ')\n';
      }
      break;
    }
    case 'RANDOM': {
      Pygol.definitions_['import_random'] = 'importe random';
      let code = cacheList();
      const xVar = Pygol.nameDB_.getDistinctName('tmp_x', NameType.VARIABLE);
      code += xVar + ' = inteiro(random.random() * comprimento(' + list + '))\n';
      if (mode === 'SET') {
        code += list + '[' + xVar + '] = ' + value + '\n';
        return code;
      } else if (mode === 'INSERT') {
        code += list + '.insert(' + xVar + ', ' + value + ')\n';
        return code;
      }
      break;
    }
  }
  throw Error('Unhandled combination (lists_setIndex).');
};

Pygol['lists_getSublist'] = function(block) {
  // Get sublist.
  const list = Pygol.valueToCode(block, 'LIST', Pygol.ORDER_MEMBER) || '[]';
  const where1 = block.getFieldValue('WHERE1');
  const where2 = block.getFieldValue('WHERE2');
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
      throw Error('Unhandled option (lists_getSublist)');
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
        Pygol.definitions_['import_sys'] = 'import sys';
        at2 += ' or sys.maxsize';
      } else if (at2 === 0) {
        at2 = '';
      }
      break;
    case 'LAST':
      at2 = '';
      break;
    default:
      throw Error('Unhandled option (lists_getSublist)');
  }
  const code = list + '[' + at1 + ' : ' + at2 + ']';
  return [code, Pygol.ORDER_MEMBER];
};

Pygol['lists_sort'] = function(block) {
  // Block for sorting a list.
  const list = (Pygol.valueToCode(block, 'LIST', Pygol.ORDER_NONE) || '[]');
  const type = block.getFieldValue('TYPE');
  const reverse = block.getFieldValue('DIRECTION') === '1' ? 'falso' : 'verdadeiro';
  const sortFunctionName = Pygol.provideFunction_('lists_sort', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(my_list, type, reverse):
  def try_float(s):
    try:
      return float(s)
    except:
      return 0
  key_funcs = {
    "NUMERIC": try_float,
    "TEXT": str,
    "IGNORE_CASE": lambda s: str(s).lower()
  }
  key_func = key_funcs[type]
  list_cpy = list(my_list)
  return sorted(list_cpy, key=key_func, reverse=reverse)
`);

  const code =
      sortFunctionName + '(' + list + ', "' + type + '", ' + reverse + ')';
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['lists_split'] = function(block) {
  // Block for splitting text into a list, or joining a list into text.
  const mode = block.getFieldValue('MODE');
  let code;
  if (mode === 'SPLIT') {
    const value_input =
        Pygol.valueToCode(block, 'INPUT', Pygol.ORDER_MEMBER) || "''";
    const value_delim = Pygol.valueToCode(block, 'DELIM', Pygol.ORDER_NONE);
    code = value_input + '.split(' + value_delim + ')';
  } else if (mode === 'JOIN') {
    const value_input =
        Pygol.valueToCode(block, 'INPUT', Pygol.ORDER_NONE) || '[]';
    const value_delim =
        Pygol.valueToCode(block, 'DELIM', Pygol.ORDER_MEMBER) || "''";
    code = value_delim + '.join(' + value_input + ')';
  } else {
    throw Error('Unknown mode: ' + mode);
  }
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['lists_reverse'] = function(block) {
  // Block for reversing a list.
  const list = Pygol.valueToCode(block, 'LIST', Pygol.ORDER_NONE) || '[]';
  const code = 'lista(reversed(' + list + '))';
  return [code, Pygol.ORDER_FUNCTION_CALL];
};
// Ok