/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.PreviousConnection');
import { Connection } from './connection.js';
import { Types } from './types.js';
/**
 * An object containing information about the space a previous connection takes
 * up during rendering.
 */
export class PreviousConnection extends Connection {
    /**
     * @param constants The rendering constants provider.
     * @param connectionModel The connection object on the block that this
     *     represents.
     */
    constructor(constants, connectionModel) {
        super(constants, connectionModel);
        this.type |= Types.PREVIOUS_CONNECTION;
        this.height = this.shape.height;
        this.width = this.shape.width;
    }
}
//# sourceMappingURL=previous_connection.js.map