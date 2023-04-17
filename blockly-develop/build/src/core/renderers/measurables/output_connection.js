/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.OutputConnection');
import { Connection } from './connection.js';
import { Types } from './types.js';
/**
 * An object containing information about the space an output connection takes
 * up during rendering.
 */
export class OutputConnection extends Connection {
    /**
     * @param constants The rendering constants provider.
     * @param connectionModel The connection object on the block that this
     *     represents.
     */
    constructor(constants, connectionModel) {
        super(constants, connectionModel);
        this.connectionOffsetX = 0;
        this.type |= Types.OUTPUT_CONNECTION;
        this.height = !this.isDynamicShape ? this.shape.height : 0;
        this.width = !this.isDynamicShape ? this.shape.width : 0;
        this.startX = this.width;
        this.connectionOffsetY = this.constants_.TAB_OFFSET_FROM_TOP;
    }
}
//# sourceMappingURL=output_connection.js.map