/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.zelos.RightConnectionShape');
import { Measurable } from '../../../renderers/measurables/base.js';
import { Types } from '../../../renderers/measurables/types.js';
/**
 * An object containing information about the space a right connection shape
 * takes up during rendering.
 */
export class RightConnectionShape extends Measurable {
    /**
     * @param constants The rendering constants provider.
     */
    constructor(constants) {
        super(constants);
        // Size is dynamic
        this.height = 0;
        this.width = 0;
        this.type |= Types.getType('RIGHT_CONNECTION');
    }
}
//# sourceMappingURL=row_elements.js.map