/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.Hat');
import { Measurable } from './base.js';
import { Types } from './types.js';
/**
 * An object containing information about the space a hat takes up during
 * rendering.
 */
export class Hat extends Measurable {
    /**
     * @param constants The rendering constants provider.
     */
    constructor(constants) {
        super(constants);
        this.type |= Types.HAT;
        this.height = this.constants_.START_HAT.height;
        this.width = this.constants_.START_HAT.width;
        this.ascenderHeight = this.height;
    }
}
//# sourceMappingURL=hat.js.map