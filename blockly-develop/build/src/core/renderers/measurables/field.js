/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.Field');
import { Measurable } from './base.js';
import { Types } from './types.js';
/**
 * An object containing information about the space a field takes up during
 * rendering
 */
export class Field extends Measurable {
    /**
     * @param constants The rendering constants provider.
     * @param field The field to measure and store information for.
     * @param parentInput The parent input for the field.
     */
    constructor(constants, field, parentInput) {
        super(constants);
        this.field = field;
        this.parentInput = parentInput;
        this.isEditable = field.EDITABLE;
        this.flipRtl = field.getFlipRtl();
        this.type |= Types.FIELD;
        const size = this.field.getSize();
        this.height = size.height;
        this.width = size.width;
    }
}
//# sourceMappingURL=field.js.map