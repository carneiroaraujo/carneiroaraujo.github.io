/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @internal */
export function isLegacyProcedureDefBlock(block) {
    return block.getProcedureDef !== undefined;
}
/** @internal */
export function isLegacyProcedureCallBlock(block) {
    return block.getProcedureCall !== undefined &&
        block.renameProcedure !== undefined;
}
//# sourceMappingURL=i_legacy_procedure_blocks.js.map