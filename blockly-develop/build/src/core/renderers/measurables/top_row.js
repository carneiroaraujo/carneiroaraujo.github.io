/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.TopRow');
import { Hat } from './hat.js';
import { Row } from './row.js';
import { Types } from './types.js';
/**
 * An object containing information about what elements are in the top row of a
 * block as well as sizing information for the top row.
 * Elements in a top row can consist of corners, hats, spacers, and previous
 * connections.
 * After this constructor is called, the row will contain all non-spacer
 * elements it needs.
 */
export class TopRow extends Row {
    /**
     * @param constants The rendering constants provider.
     */
    constructor(constants) {
        super(constants);
        /**
         * The starting point for drawing the row, in the y direction.
         * This allows us to draw hats and similar shapes that don't start at the
         * origin. Must be non-negative (see #2820).
         */
        this.capline = 0;
        /** How much the row extends up above its capline. */
        this.ascenderHeight = 0;
        /** Whether the block has a previous connection. */
        this.hasPreviousConnection = false;
        /** The previous connection on the block, if any. */
        this.connection = null;
        this.type |= Types.TOP_ROW;
    }
    /**
     * Returns whether or not the top row has a left square corner.
     *
     * @param block The block whose top row this represents.
     * @returns Whether or not the top row has a left square corner.
     */
    hasLeftSquareCorner(block) {
        const hasHat = (block.hat ? block.hat === 'cap' : this.constants_.ADD_START_HATS) &&
            !block.outputConnection && !block.previousConnection;
        const prevBlock = block.getPreviousBlock();
        return !!block.outputConnection || hasHat ||
            (prevBlock ? prevBlock.getNextBlock() === block : false);
    }
    /**
     * Returns whether or not the top row has a right square corner.
     *
     * @param _block The block whose top row this represents.
     * @returns Whether or not the top row has a right square corner.
     */
    hasRightSquareCorner(_block) {
        return true;
    }
    measure() {
        let height = 0;
        let width = 0;
        let ascenderHeight = 0;
        for (let i = 0; i < this.elements.length; i++) {
            const elem = this.elements[i];
            width += elem.width;
            if (!Types.isSpacer(elem)) {
                if (Types.isHat(elem) && elem instanceof Hat) {
                    ascenderHeight = Math.max(ascenderHeight, elem.ascenderHeight);
                }
                else {
                    height = Math.max(height, elem.height);
                }
            }
        }
        this.width = Math.max(this.minWidth, width);
        this.height = Math.max(this.minHeight, height) + ascenderHeight;
        this.ascenderHeight = ascenderHeight;
        this.capline = this.ascenderHeight;
        this.widthWithConnectedBlocks = this.width;
    }
    startsWithElemSpacer() {
        return false;
    }
    endsWithElemSpacer() {
        return false;
    }
}
//# sourceMappingURL=top_row.js.map