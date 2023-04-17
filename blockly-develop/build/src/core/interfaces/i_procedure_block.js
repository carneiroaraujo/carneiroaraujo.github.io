/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.procedures.IProcedureBlock');
/** A type guard which checks if the given block is a procedure block. */
export function isProcedureBlock(block) {
    return block.getProcedureModel !== undefined &&
        block.doProcedureUpdate !== undefined &&
        block.isProcedureDef !== undefined;
}
//# sourceMappingURL=i_procedure_block.js.map