/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.Measurable');
import { Types } from './types.js';
/**
 * The base class to represent a part of a block that takes up space during
 * rendering.  The constructor for each non-spacer Measurable records the size
 * of the block element (e.g. field, statement input).
 */
export class Measurable {
    /**
     * @param constants The rendering constants provider.
     */
    constructor(constants) {
        this.width = 0;
        this.height = 0;
        this.xPos = 0;
        this.centerline = 0;
        this.constants_ = constants;
        this.type = Types.NONE;
        this.notchOffset = this.constants_.NOTCH_OFFSET_LEFT;
    }
}
//# sourceMappingURL=base.js.map