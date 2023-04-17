/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.NextConnection');
import { Connection } from './connection.js';
import { Types } from './types.js';
/**
 * An object containing information about the space a next connection takes
 * up during rendering.
 */
export class NextConnection extends Connection {
    /**
     * @param constants The rendering constants provider.
     * @param connectionModel The connection object on the block that this
     *     represents.
     */
    constructor(constants, connectionModel) {
        super(constants, connectionModel);
        this.type |= Types.NEXT_CONNECTION;
        this.height = this.shape.height;
        this.width = this.shape.width;
    }
}
//# sourceMappingURL=next_connection.js.map