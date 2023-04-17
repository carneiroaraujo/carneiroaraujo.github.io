/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The abstract class for a component with custom behaviour when a
 * block or bubble is dragged over or dropped on top of it.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.DragTarget');
/**
 * Abstract class for a component with custom behaviour when a block or bubble
 * is dragged over or dropped on top of it.
 */
export class DragTarget {
    /**
     * Constructor for DragTarget. It exists to add the id property and should not
     * be called directly, only by a subclass.
     */
    constructor() { }
    /**
     * Handles when a cursor with a block or bubble enters this drag target.
     *
     * @param _dragElement The block or bubble currently being dragged.
     */
    onDragEnter(_dragElement) { }
    // no-op
    /**
     * Handles when a cursor with a block or bubble is dragged over this drag
     * target.
     *
     * @param _dragElement The block or bubble currently being dragged.
     */
    onDragOver(_dragElement) { }
    // no-op
    /**
     * Handles when a cursor with a block or bubble exits this drag target.
     *
     * @param _dragElement The block or bubble currently being dragged.
     */
    onDragExit(_dragElement) { }
    // no-op
    /**
     * Handles when a block or bubble is dropped on this component.
     * Should not handle delete here.
     *
     * @param _dragElement The block or bubble currently being dragged.
     */
    onDrop(_dragElement) { }
    // no-op
    /**
     * Returns the bounding rectangle of the drag target area in pixel units
     * relative to the Blockly injection div.
     *
     * @returns The component's bounding box. Null if drag target area should be
     *     ignored.
     */
    getClientRect() {
        return null;
    }
    /**
     * Returns whether the provided block or bubble should not be moved after
     * being dropped on this component. If true, the element will return to where
     * it was when the drag started.
     *
     * @param _dragElement The block or bubble currently being dragged.
     * @returns Whether the block or bubble provided should be returned to drag
     *     start.
     */
    shouldPreventMove(_dragElement) {
        return false;
    }
}
//# sourceMappingURL=drag_target.js.map