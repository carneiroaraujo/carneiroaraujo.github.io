/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Pygol for math blocks.
 */
'use strict';

goog.module('Blockly.Pygol.math');

const {NameType} = goog.require('Blockly.Names');
const {pygolGenerator: Pygol} = goog.require('Blockly.Pygol');


// If any new block imports any library, add that library name here.
Pygol.addReservedWords('math,random,Number');

Pygol['math_number'] = function(block) {
  // Numeric value.
  let code = Number(block.getFieldValue('NUM'));
  let order;
  if (code === Infinity) {
    code = 'real("inf")';
    order = Pygol.ORDER_FUNCTION_CALL;
  } else if (code === -Infinity) {
    code = '-real("inf")';
    order = Pygol.ORDER_UNARY_SIGN;
  } else {
    order = code < 0 ? Pygol.ORDER_UNARY_SIGN : Pygol.ORDER_ATOMIC;
  }
  return [code, order];
};

Pygol['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  const OPERATORS = {
    'ADD': [' + ', Pygol.ORDER_ADDITIVE],
    'MINUS': [' - ', Pygol.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Pygol.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', Pygol.ORDER_MULTIPLICATIVE],
    'POWER': [' ** ', Pygol.ORDER_EXPONENTIATION],
  };
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Pygol.valueToCode(block, 'A', order) || '0';
  const argument1 = Pygol.valueToCode(block, 'B', order) || '0';
  const code = argument0 + operator + argument1;
  return [code, order];
  // In case of 'DIVIDE', division between integers returns different results
  // in Python 2 and 3. However, is not an issue since Blockly does not
  // guarantee identical results in all languages.  To do otherwise would
  // require every operator to be wrapped in a function call.  This would kill
  // legibility of the generated code.
};

Pygol['math_single'] = function(block) {
  // Math operators with single operand.
  const operator = block.getFieldValue('OP');
  let code;
  let arg;
  if (operator === 'NEG') {
    // Negation is a special case given its different operator precedence.
    code = Pygol.valueToCode(block, 'NUM', Pygol.ORDER_UNARY_SIGN) || '0';
    return ['-' + code, Pygol.ORDER_UNARY_SIGN];
  }
  Pygol.definitions_['import_math'] = 'import math';
  if (operator === 'SIN' || operator === 'COS' || operator === 'TAN') {
    arg = Pygol.valueToCode(block, 'NUM', Pygol.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = Pygol.valueToCode(block, 'NUM', Pygol.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'math.fabs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'math.log(' + arg + ')';
      break;
    case 'LOG10':
      code = 'math.log10(' + arg + ')';
      break;
    case 'EXP':
      code = 'math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'math.pow(10,' + arg + ')';
      break;
    case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'math.ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'math.floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'math.sin(' + arg + ' / 180.0 * math.pi)';
      break;
    case 'COS':
      code = 'math.cos(' + arg + ' / 180.0 * math.pi)';
      break;
    case 'TAN':
      code = 'math.tan(' + arg + ' / 180.0 * math.pi)';
      break;
  }
  if (code) {
    return [code, Pygol.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ASIN':
      code = 'math.asin(' + arg + ') / math.pi * 180';
      break;
    case 'ACOS':
      code = 'math.acos(' + arg + ') / math.pi * 180';
      break;
    case 'ATAN':
      code = 'math.atan(' + arg + ') / math.pi * 180';
      break;
    default:
      throw Error('Unknown math operator: ' + operator);
  }
  return [code, Pygol.ORDER_MULTIPLICATIVE];
};

Pygol['math_constant'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  const CONSTANTS = {
    'PI': ['math.pi', Pygol.ORDER_MEMBER],
    'E': ['math.e', Pygol.ORDER_MEMBER],
    'GOLDEN_RATIO': ['(1 + math.sqrt(5)) / 2', Pygol.ORDER_MULTIPLICATIVE],
    'SQRT2': ['math.sqrt(2)', Pygol.ORDER_MEMBER],
    'SQRT1_2': ['math.sqrt(1.0 / 2)', Pygol.ORDER_MEMBER],
    'INFINITY': ['real(\'inf\')', Pygol.ORDER_ATOMIC],
  };
  const constant = block.getFieldValue('CONSTANT');
  if (constant !== 'INFINITY') {
    Pygol.definitions_['import_math'] = 'importe math';
  }
  return CONSTANTS[constant];
};

Pygol['math_number_property'] = function(block) {
   // Check if a number is even, odd, prime, whole, positive, or negative
   // or if it is divisible by certain number. Returns true or false.
  const PROPERTIES = {
    'EVEN': [' % 2 == 0', Pygol.ORDER_MULTIPLICATIVE, Pygol.ORDER_RELATIONAL],
    'ODD': [' % 2 == 1', Pygol.ORDER_MULTIPLICATIVE, Pygol.ORDER_RELATIONAL],
    'WHOLE': [' % 1 == 0', Pygol.ORDER_MULTIPLICATIVE,
        Pygol.ORDER_RELATIONAL],
    'POSITIVE': [' > 0', Pygol.ORDER_RELATIONAL, Pygol.ORDER_RELATIONAL],
    'NEGATIVE': [' < 0', Pygol.ORDER_RELATIONAL, Pygol.ORDER_RELATIONAL],
    'DIVISIBLE_BY': [null, Pygol.ORDER_MULTIPLICATIVE,
        Pygol.ORDER_RELATIONAL],
    'PRIME': [null, Pygol.ORDER_NONE, Pygol.ORDER_FUNCTION_CALL],
  }
  const dropdownProperty = block.getFieldValue('PROPERTY');
  const [suffix, inputOrder, outputOrder] = PROPERTIES[dropdownProperty];
  const numberToCheck = Pygol.valueToCode(block, 'NUMBER_TO_CHECK',
      inputOrder) || '0';
  let code;
  if (dropdownProperty === 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    Pygol.definitions_['import_math'] = 'importe math';
    Pygol.definitions_['from_numbers_import_Number'] =
        'de numbers importe Number';
    const functionName = Pygol.provideFunction_('math_isPrime', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(n):
  # https://en.wikipedia.org/wiki/Primality_test#Naive_methods
  # If n is not a number but a string, try parsing it.
  if not isinstance(n, Number):
    try:
      n = float(n)
    except:
      return False
  if n == 2 or n == 3:
    return True
  # False if n is negative, is 1, or not whole, or if n is divisible by 2 or 3.
  if n <= 1 or n % 1 != 0 or n % 2 == 0 or n % 3 == 0:
    return False
  # Check all the numbers of form 6k +/- 1, up to sqrt(n).
  for x in range(6, int(math.sqrt(n)) + 2, 6):
    if n % (x - 1) == 0 or n % (x + 1) == 0:
      return False
  return True
`);
       code = functionName + '(' + numberToCheck + ')';
  } else if (dropdownProperty === 'DIVISIBLE_BY') {
    const divisor = Pygol.valueToCode(block, 'DIVISOR',
        Pygol.ORDER_MULTIPLICATIVE) || '0';
    // If 'divisor' is some code that evals to 0, Python will raise an error.
    if (divisor === '0') {
      return ['falso', Pygol.ORDER_ATOMIC];
    }
    code = numberToCheck + ' % ' + divisor + ' == 0';
  } else {
    code = numberToCheck + suffix;
  };
  return [code, outputOrder];
};

Pygol['math_change'] = function(block) {
  // Add to a variable in place.
  Pygol.definitions_['from_numbers_import_Number'] =
      'de numbers importe Number';
  const argument0 =
      Pygol.valueToCode(block, 'DELTA', Pygol.ORDER_ADDITIVE) || '0';
  const varName =
      Pygol.nameDB_.getName(block.getFieldValue('VAR'), NameType.VARIABLE);
  return varName + ' = (' + varName + ' se isinstance(' + varName +
      ', Number) senao 0) + ' + argument0 + '\n';
};

// Rounding functions have a single operand.
Pygol['math_round'] = Pygol['math_single'];
// Trigonometry functions have a single operand.
Pygol['math_trig'] = Pygol['math_single'];

Pygol['math_on_list'] = function(block) {
  // Math functions for lists.
  const func = block.getFieldValue('OP');
  const list = Pygol.valueToCode(block, 'LIST', Pygol.ORDER_NONE) || '[]';
  let code;
  switch (func) {
    case 'SUM':
      code = 'sum(' + list + ')';
      break;
    case 'MIN':
      code = 'min(' + list + ')';
      break;
    case 'MAX':
      code = 'max(' + list + ')';
      break;
    case 'AVERAGE': {
      Pygol.definitions_['from_numbers_import_Number'] =
          'de numbers importe Number';
      // This operation excludes null and values that aren't int or float:
      // math_mean([null, null, "aString", 1, 9]) -> 5.0
      const functionName = Pygol.provideFunction_('math_mean', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(myList):
  localList = [e for e in myList if isinstance(e, Number)]
  if not localList: return
  return float(sum(localList)) / len(localList)
`);
      code = functionName + '(' + list + ')';
      break;
    }
    case 'MEDIAN': {
      Pygol.definitions_['from_numbers_import_Number'] =
          'de numbers importe Number';
      // This operation excludes null values:
      // math_median([null, null, 1, 3]) -> 2.0
      const functionName = Pygol.provideFunction_( 'math_median', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(myList):
  localList = sorted([e for e in myList if isinstance(e, Number)])
  if not localList: return
  if len(localList) % 2 == 0:
    return (localList[len(localList) // 2 - 1] + localList[len(localList) // 2]) / 2.0
  else:
    return localList[(len(localList) - 1) // 2]
`);
      code = functionName + '(' + list + ')';
      break;
    }
    case 'MODE': {
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1]
      const functionName = Pygol.provideFunction_('math_modes', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(some_list):
  modes = []
  # Using a lists of [item, count] to keep count rather than dict
  # to avoid "unhashable" errors when the counted item is itself a list or dict.
  counts = []
  maxCount = 1
  for item in some_list:
    found = False
    for count in counts:
      if count[0] == item:
        count[1] += 1
        maxCount = max(maxCount, count[1])
        found = True
    if not found:
      counts.append([item, 1])
  for counted_item, item_count in counts:
    if item_count == maxCount:
      modes.append(counted_item)
  return modes
`);
      code = functionName + '(' + list + ')';
      break;
    }
    case 'STD_DEV': {
      Pygol.definitions_['import_math'] = 'importe math';
      const functionName = Pygol.provideFunction_('math_standard_deviation', `
def ${Pygol.FUNCTION_NAME_PLACEHOLDER_}(numbers):
  n = len(numbers)
  if n == 0: return
  mean = float(sum(numbers)) / n
  variance = sum((x - mean) ** 2 for x in numbers) / n
  return math.sqrt(variance)
`);
      code = functionName + '(' + list + ')';
      break;
    }
    case 'RANDOM':
      Pygol.definitions_['import_random'] = 'importe random';
      code = 'random.choice(' + list + ')';
      break;
    default:
      throw Error('Unknown operator: ' + func);
  }
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['math_modulo'] = function(block) {
  // Remainder computation.
  const argument0 =
      Pygol.valueToCode(block, 'DIVIDEND', Pygol.ORDER_MULTIPLICATIVE) || '0';
  const argument1 =
      Pygol.valueToCode(block, 'DIVISOR', Pygol.ORDER_MULTIPLICATIVE) || '0';
  const code = argument0 + ' % ' + argument1;
  return [code, Pygol.ORDER_MULTIPLICATIVE];
};

Pygol['math_constrain'] = function(block) {
  // Constrain a number between two limits.
  const argument0 =
      Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || '0';
  const argument1 = Pygol.valueToCode(block, 'LOW', Pygol.ORDER_NONE) || '0';
  const argument2 =
      Pygol.valueToCode(block, 'HIGH', Pygol.ORDER_NONE) || 'real(\'inf\')';
  const code =
      'min(max(' + argument0 + ', ' + argument1 + '), ' + argument2 + ')';
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  Pygol.definitions_['import_random'] = 'importe random';
  const argument0 = Pygol.valueToCode(block, 'FROM', Pygol.ORDER_NONE) || '0';
  const argument1 = Pygol.valueToCode(block, 'TO', Pygol.ORDER_NONE) || '0';
  const code = 'random.randint(' + argument0 + ', ' + argument1 + ')';
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  Pygol.definitions_['import_random'] = 'importe random';
  return ['random.random()', Pygol.ORDER_FUNCTION_CALL];
};

Pygol['math_atan2'] = function(block) {
  // Arctangent of point (X, Y) in degrees from -180 to 180.
  Pygol.definitions_['import_math'] = 'import math';
  const argument0 = Pygol.valueToCode(block, 'X', Pygol.ORDER_NONE) || '0';
  const argument1 = Pygol.valueToCode(block, 'Y', Pygol.ORDER_NONE) || '0';
  return [
    'math.atan2(' + argument1 + ', ' + argument0 + ') / math.pi * 180',
    Pygol.ORDER_MULTIPLICATIVE
  ];
};
// Ok