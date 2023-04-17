/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.zelos.BottomRow');
import { BottomRow as BaseBottomRow } from '../../../renderers/measurables/bottom_row.js';
/**
 * An object containing information about what elements are in the bottom row of
 * a block as well as spacing information for the top row.
 * Elements in a bottom row can consist of corners, spacers and next
 * connections.
 */
export class BottomRow extends BaseBottomRow {
    /**
     * @param constants The rendering constants provider.
     */
    constructor(constants) {
        super(constants);
    }
    endsWithElemSpacer() {
        return false;
    }
    /** Render a round corner unless the block has an output connection. */
    hasLeftSquareCorner(block) {
        return !!block.outputConnection;
    }
    /** Render a round corner unless the block has an output connection. */
    hasRightSquareCorner(block) {
        return !!block.outputConnection && !block.statementInputCount &&
            !block.nextConnection;
    }
}
//# sourceMappingURL=bottom_row.js.map