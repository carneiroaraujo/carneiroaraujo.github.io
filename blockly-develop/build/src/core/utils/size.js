/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Utility methods for size calculation.
 * These methods are not specific to Blockly, and could be factored out into
 * a JavaScript framework such as Closure.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.utils.Size');
/**
 * Class for representing sizes consisting of a width and height.
 */
export class Size {
    /**
     * @param width Width.
     * @param height Height.
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    /**
     * Compares sizes for equality.
     *
     * @param a A Size.
     * @param b A Size.
     * @returns True iff the sizes have equal widths and equal heights, or if both
     *     are null.
     */
    static equals(a, b) {
        if (a === b) {
            return true;
        }
        if (!a || !b) {
            return false;
        }
        return a.width === b.width && a.height === b.height;
    }
}
//# sourceMappingURL=size.js.map