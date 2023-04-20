/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Generating Pygol for logic blocks.
 */
'use strict';
goog.module('Blockly.Pygol.logic');
const { pygolGenerator: Pygol } = goog.require('Blockly.Pygol');
Pygol['controls_if'] = function (block) {
    // If/elseif/else condition.
    let n = 0;
    let code = '', branchCode, conditionCode;
    if (Pygol.STATEMENT_PREFIX) {
        // Automatic prefix insertion is switched off for this block.  Add manually.
        code += Pygol.injectId(Pygol.STATEMENT_PREFIX, block);
    }
    do {
        conditionCode =
            Pygol.valueToCode(block, 'IF' + n, Pygol.ORDER_NONE) || 'falso';
        branchCode = Pygol.statementToCode(block, 'DO' + n) || Pygol.PASS;
        if (Pygol.STATEMENT_SUFFIX) {
            branchCode =
                Pygol.prefixLines(Pygol.injectId(Pygol.STATEMENT_SUFFIX, block), Pygol.INDENT) +
                    branchCode;
        }
        code += (n === 0 ? 'se ' : 'senaose ') + conditionCode + ':\n' + branchCode;
        n++;
    } while (block.getInput('IF' + n));
    if (block.getInput('ELSE') || Pygol.STATEMENT_SUFFIX) {
        branchCode = Pygol.statementToCode(block, 'ELSE') || Pygol.PASS;
        if (Pygol.STATEMENT_SUFFIX) {
            branchCode =
                Pygol.prefixLines(Pygol.injectId(Pygol.STATEMENT_SUFFIX, block), Pygol.INDENT) +
                    branchCode;
        }
        code += 'senao:\n' + branchCode;
    }
    return code;
};
Pygol['controls_ifelse'] = Pygol['controls_if'];
Pygol['logic_compare'] = function (block) {
    // Comparison operator.
    const OPERATORS = { 'EQ': '==', 'NEQ': '!=', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>=' };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const order = Pygol.ORDER_RELATIONAL;
    const argument0 = Pygol.valueToCode(block, 'A', order) || '0';
    const argument1 = Pygol.valueToCode(block, 'B', order) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
};
Pygol['logic_operation'] = function (block) {
    // Operations 'and', 'or'.
    const operator = (block.getFieldValue('OP') === 'AND') ? 'e' : 'ou';
    const order = (operator === 'e') ? Pygol.ORDER_LOGICAL_AND : Pygol.ORDER_LOGICAL_OR;
    let argument0 = Pygol.valueToCode(block, 'A', order);
    let argument1 = Pygol.valueToCode(block, 'B', order);
    if (!argument0 && !argument1) {
        // If there are no arguments, then the return value is false.
        argument0 = 'falso';
        argument1 = 'falso';
    }
    else {
        // Single missing arguments have no effect on the return value.
        const defaultArgument = (operator === 'e') ? 'verdadeiro' : 'falso';
        if (!argument0) {
            argument0 = defaultArgument;
        }
        if (!argument1) {
            argument1 = defaultArgument;
        }
    }
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
};
Pygol['logic_negate'] = function (block) {
    // Negation.
    const argument0 = Pygol.valueToCode(block, 'BOOL', Pygol.ORDER_LOGICAL_NOT) || 'verdadeiro';
    const code = 'nao ' + argument0;
    return [code, Pygol.ORDER_LOGICAL_NOT];
};
Pygol['logic_boolean'] = function (block) {
    // Boolean values true and false.
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'verdadeiro' : 'falso';
    return [code, Pygol.ORDER_ATOMIC];
};
Pygol['logic_null'] = function (block) {
    // Null data type.
    return ['None', Pygol.ORDER_ATOMIC];
};
Pygol['logic_ternary'] = function (block) {
    // Ternary operator.
    const value_if = Pygol.valueToCode(block, 'IF', Pygol.ORDER_CONDITIONAL) || 'falso';
    const value_then = Pygol.valueToCode(block, 'THEN', Pygol.ORDER_CONDITIONAL) || 'nulo';
    const value_else = Pygol.valueToCode(block, 'ELSE', Pygol.ORDER_CONDITIONAL) || 'nulo';
    const code = value_then + ' se ' + value_if + ' senao ' + value_else;
    return [code, Pygol.ORDER_CONDITIONAL];
};
//# sourceMappingURL=logic.js.map