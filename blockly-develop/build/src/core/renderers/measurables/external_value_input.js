/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.ExternalValueInput');
import { InputConnection } from './input_connection.js';
import { Types } from './types.js';
/**
 * An object containing information about the space an external value input
 * takes up during rendering
 */
export class ExternalValueInput extends InputConnection {
    /**
     * @param constants The rendering constants provider.
     * @param input The external value input to measure and store information for.
     */
    constructor(constants, input) {
        super(constants, input);
        this.height = 0;
        this.type |= Types.EXTERNAL_VALUE_INPUT;
        if (!this.connectedBlock) {
            this.height = this.shape.height;
        }
        else {
            this.height = this.connectedBlockHeight -
                this.constants_.TAB_OFFSET_FROM_TOP - this.constants_.MEDIUM_PADDING;
        }
        this.width = this.shape.width + this.constants_.EXTERNAL_VALUE_INPUT_PADDING;
        this.connectionOffsetY = this.constants_.TAB_OFFSET_FROM_TOP;
        this.connectionHeight = this.shape.height;
        this.connectionWidth = this.shape.width;
    }
}
//# sourceMappingURL=external_value_input.js.map