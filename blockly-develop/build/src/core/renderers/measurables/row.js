/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.Row');
import { Types } from './types.js';
/**
 * An object representing a single row on a rendered block and all of its
 * subcomponents.
 */
export class Row {
    /**
     * @param constants The rendering constants provider.
     */
    constructor(constants) {
        /**
         * An array of elements contained in this row.
         */
        this.elements = [];
        /**
         * The height of the row.
         */
        this.height = 0;
        /**
         * The width of the row, from the left edge of the block to the right.
         * Does not include child blocks unless they are inline.
         */
        this.width = 0;
        /**
         * The minimum height of the row.
         */
        this.minHeight = 0;
        /**
         * The minimum width of the row, from the left edge of the block to the
         * right. Does not include child blocks unless they are inline.
         */
        this.minWidth = 0;
        /**
         * The width of the row, from the left edge of the block to the edge of the
         * block or any connected child blocks.
         */
        this.widthWithConnectedBlocks = 0;
        /**
         * The Y position of the row relative to the origin of the block's svg
         * group.
         */
        this.yPos = 0;
        /**
         * The X position of the row relative to the origin of the block's svg
         * group.
         */
        this.xPos = 0;
        /**
         * Whether the row has any external inputs.
         */
        this.hasExternalInput = false;
        /**
         * Whether the row has any statement inputs.
         */
        this.hasStatement = false;
        /**
         * Where the left edge of all of the statement inputs on the block should
         * be. This makes sure that statement inputs which are proceded by fields
         * of varius widths are all aligned.
         */
        this.statementEdge = 0;
        /**
         * Whether the row has any inline inputs.
         */
        this.hasInlineInput = false;
        /**
         * Whether the row has any dummy inputs.
         */
        this.hasDummyInput = false;
        /**
         * Whether the row has a jagged edge.
         */
        this.hasJaggedEdge = false;
        /**
         * Alignment of the row.
         */
        this.align = null;
        /** The renderer's constant provider. */
        this.constants_ = constants;
        /** The type of this rendering object. */
        this.type = Types.ROW;
        this.notchOffset = this.constants_.NOTCH_OFFSET_LEFT;
    }
    /**
     * Get the last input on this row, if it has one.
     *
     * @returns The last input on the row, or null.
     */
    getLastInput() {
        // TODO: Consider moving this to InputRow, if possible.
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const elem = this.elements[i];
            if (Types.isInput(elem)) {
                return elem;
            }
        }
        return null;
    }
    /**
     * Inspect all subcomponents and populate all size properties on the row.
     */
    measure() {
        throw Error('Unexpected attempt to measure a base Row.');
    }
    /**
     * Determines whether this row should start with an element spacer.
     *
     * @returns Whether the row should start with a spacer.
     */
    startsWithElemSpacer() {
        return true;
    }
    /**
     * Determines whether this row should end with an element spacer.
     *
     * @returns Whether the row should end with a spacer.
     */
    endsWithElemSpacer() {
        return true;
    }
    /**
     * Convenience method to get the first spacer element on this row.
     *
     * @returns The first spacer element on this row.
     */
    getFirstSpacer() {
        for (let i = 0; i < this.elements.length; i++) {
            const elem = this.elements[i];
            if (Types.isSpacer(elem)) {
                return elem;
            }
        }
        return null;
    }
    /**
     * Convenience method to get the last spacer element on this row.
     *
     * @returns The last spacer element on this row.
     */
    getLastSpacer() {
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const elem = this.elements[i];
            if (Types.isSpacer(elem)) {
                return elem;
            }
        }
        return null;
    }
}
//# sourceMappingURL=row.js.map