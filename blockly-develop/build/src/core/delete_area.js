/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The abstract class for a component that can delete a block or
 * bubble that is dropped on top of it.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.DeleteArea');
import { BlockSvg } from './block_svg.js';
import { DragTarget } from './drag_target.js';
/**
 * Abstract class for a component that can delete a block or bubble that is
 * dropped on top of it.
 */
export class DeleteArea extends DragTarget {
    /**
     * Constructor for DeleteArea. Should not be called directly, only by a
     * subclass.
     */
    constructor() {
        super();
        /**
         * Whether the last block or bubble dragged over this delete area would be
         * deleted if dropped on this component.
         * This property is not updated after the block or bubble is deleted.
         */
        this.wouldDelete_ = false;
    }
    /**
     * Returns whether the provided block or bubble would be deleted if dropped on
     * this area.
     * This method should check if the element is deletable and is always called
     * before onDragEnter/onDragOver/onDragExit.
     *
     * @param element The block or bubble currently being dragged.
     * @param couldConnect Whether the element could could connect to another.
     * @returns Whether the element provided would be deleted if dropped on this
     *     area.
     */
    wouldDelete(element, couldConnect) {
        if (element instanceof BlockSvg) {
            const block = (element);
            const couldDeleteBlock = !block.getParent() && block.isDeletable();
            this.updateWouldDelete_(couldDeleteBlock && !couldConnect);
        }
        else {
            this.updateWouldDelete_(element.isDeletable());
        }
        return this.wouldDelete_;
    }
    /**
     * Updates the internal wouldDelete_ state.
     *
     * @param wouldDelete The new value for the wouldDelete state.
     */
    updateWouldDelete_(wouldDelete) {
        this.wouldDelete_ = wouldDelete;
    }
}
//# sourceMappingURL=delete_area.js.map