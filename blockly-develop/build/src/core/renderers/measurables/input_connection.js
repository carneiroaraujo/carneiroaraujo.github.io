/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.InputConnection');
import { Connection } from './connection.js';
import { Types } from './types.js';
/**
 * The base class to represent an input that takes up space on a block
 * during rendering.
 */
export class InputConnection extends Connection {
    /**
     * @param constants The rendering constants provider.
     * @param input The input to measure and store information for.
     */
    constructor(constants, input) {
        super(constants, input.connection);
        this.input = input;
        this.connectionOffsetX = 0;
        this.connectionOffsetY = 0;
        this.type |= Types.INPUT;
        this.align = input.align;
        this.connectedBlock =
            (input.connection && input.connection.targetBlock() ?
                input.connection.targetBlock() :
                null);
        if (this.connectedBlock) {
            const bBox = this.connectedBlock.getHeightWidth();
            this.connectedBlockWidth = bBox.width;
            this.connectedBlockHeight = bBox.height;
        }
        else {
            this.connectedBlockWidth = 0;
            this.connectedBlockHeight = 0;
        }
    }
}
//# sourceMappingURL=input_connection.js.map