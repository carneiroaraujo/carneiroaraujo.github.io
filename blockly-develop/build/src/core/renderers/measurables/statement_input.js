/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.StatementInput');
import { InputConnection } from './input_connection.js';
import { Types } from './types.js';
/**
 * An object containing information about the space a statement input takes up
 * during rendering
 */
export class StatementInput extends InputConnection {
    /**
     * @param constants The rendering constants provider.
     * @param input The statement input to measure and store information for.
     */
    constructor(constants, input) {
        super(constants, input);
        this.type |= Types.STATEMENT_INPUT;
        if (!this.connectedBlock) {
            this.height = this.constants_.EMPTY_STATEMENT_INPUT_HEIGHT;
        }
        else {
            // We allow the dark path to show on the parent block so that the child
            // block looks embossed.  This takes up an extra pixel in both x and y.
            this.height =
                this.connectedBlockHeight + this.constants_.STATEMENT_BOTTOM_SPACER;
        }
        this.width = this.constants_.STATEMENT_INPUT_NOTCH_OFFSET +
            this.shape.width;
    }
}
//# sourceMappingURL=statement_input.js.map