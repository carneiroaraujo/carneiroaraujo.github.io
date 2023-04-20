/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Python for procedure blocks.
 */
'use strict';

goog.module('Blockly.Pygol.procedures');

const Variables = goog.require('Blockly.Variables');
const {NameType} = goog.require('Blockly.Names');
const {pygolGenerator: Pygol} = goog.require('Blockly.Pygol');


Pygol['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  // First, add a 'global' statement for every variable that is not shadowed by
  // a local parameter.
  const globals = [];
  const workspace = block.workspace;
  const usedVariables = Variables.allUsedVarModels(workspace) || [];
  for (let i = 0, variable; (variable = usedVariables[i]); i++) {
    const varName = variable.name;
    if (block.getVars().indexOf(varName) === -1) {
      globals.push(Pygol.nameDB_.getName(varName, NameType.VARIABLE));
    }
  }
  // Add developer variables.
  const devVarList = Variables.allDeveloperVariables(workspace);
  for (let i = 0; i < devVarList.length; i++) {
    globals.push(
        Pygol.nameDB_.getName(devVarList[i], NameType.DEVELOPER_VARIABLE));
  }

  const globalString = globals.length ?
      Pygol.INDENT + 'global ' + globals.join(', ') + '\n' :
      '';
  const funcName =
      Pygol.nameDB_.getName(block.getFieldValue('NAME'), NameType.PROCEDURE);
  let xfix1 = '';
  if (Pygol.STATEMENT_PREFIX) {
    xfix1 += Pygol.injectId(Pygol.STATEMENT_PREFIX, block);
  }
  if (Pygol.STATEMENT_SUFFIX) {
    xfix1 += Pygol.injectId(Pygol.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = Pygol.prefixLines(xfix1, Pygol.INDENT);
  }
  let loopTrap = '';
  if (Pygol.INFINITE_LOOP_TRAP) {
    loopTrap = Pygol.prefixLines(
        Pygol.injectId(Pygol.INFINITE_LOOP_TRAP, block), Pygol.INDENT);
  }
  let branch = Pygol.statementToCode(block, 'STACK');
  let returnValue =
      Pygol.valueToCode(block, 'RETURN', Pygol.ORDER_NONE) || '';
  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Pygol.INDENT + 'retorne ' + returnValue + '\n';
  } else if (!branch) {
    branch = Pygol.PASS;
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = Pygol.nameDB_.getName(variables[i], NameType.VARIABLE);
  }
  let code = 'def ' + funcName + '(' + args.join(', ') + '):\n' + globalString +
      xfix1 + loopTrap + branch + xfix2 + returnValue;
  code = Pygol.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Pygol.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Pygol['procedures_defnoreturn'] = Pygol['procedures_defreturn'];

Pygol['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  const funcName =
      Pygol.nameDB_.getName(block.getFieldValue('NAME'), NameType.PROCEDURE);
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = Pygol.valueToCode(block, 'ARG' + i, Pygol.ORDER_NONE) || 'nulo';
  }
  const code = funcName + '(' + args.join(', ') + ')';
  return [code, Pygol.ORDER_FUNCTION_CALL];
};

Pygol['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  const tuple = Pygol['procedures_callreturn'](block);
  return tuple[0] + '\n';
};

Pygol['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  const condition =
      Pygol.valueToCode(block, 'CONDITION', Pygol.ORDER_NONE) || 'falso';
  let code = 'if ' + condition + ':\n';
  if (Pygol.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Pygol.prefixLines(
        Pygol.injectId(Pygol.STATEMENT_SUFFIX, block), Pygol.INDENT);
  }
  if (block.hasReturnValue_) {
    const value =
        Pygol.valueToCode(block, 'VALUE', Pygol.ORDER_NONE) || 'nulo';
    code += Pygol.INDENT + 'retorne ' + value + '\n';
  } else {
    code += Pygol.INDENT + 'retorne\n';
  }
  return code;
};
// Ok