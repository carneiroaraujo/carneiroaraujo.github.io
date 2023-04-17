/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.SpacerRow');
import { InRowSpacer } from './in_row_spacer.js';
import { Row } from './row.js';
import { Types } from './types.js';
/**
 * An object containing information about a spacer between two rows.
 */
export class SpacerRow extends Row {
    /**
     * @param constants The rendering constants provider.
     * @param height The height of the spacer.
     * @param width The width of the spacer.
     */
    constructor(constants, height, width) {
        super(constants);
        this.height = height;
        this.width = width;
        this.followsStatement = false;
        this.precedesStatement = false;
        this.widthWithConnectedBlocks = 0;
        this.type |= Types.SPACER | Types.BETWEEN_ROW_SPACER;
        this.elements = [new InRowSpacer(this.constants_, width)];
    }
    measure() { }
}
// NOP.  Width and height were set at creation.
//# sourceMappingURL=spacer_row.js.map