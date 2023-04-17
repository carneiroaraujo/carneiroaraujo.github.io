/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The class representing a marker.
 * Used primarily for keyboard navigation to show a marked location.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Marker');
/**
 * Class for a marker.
 * This is used in keyboard navigation to save a location in the Blockly AST.
 */
export class Marker {
    /** Constructs a new Marker instance. */
    constructor() {
        /** The colour of the marker. */
        this.colour = null;
        /** The current location of the marker. */
        // AnyDuringMigration because:  Type 'null' is not assignable to type
        // 'ASTNode'.
        this.curNode = null;
        /**
         * The object in charge of drawing the visual representation of the current
         * node.
         */
        // AnyDuringMigration because:  Type 'null' is not assignable to type
        // 'MarkerSvg'.
        this.drawer = null;
        /** The type of the marker. */
        this.type = 'marker';
    }
    /**
     * Sets the object in charge of drawing the marker.
     *
     * @param drawer The object in charge of drawing the marker.
     */
    setDrawer(drawer) {
        this.drawer = drawer;
    }
    /**
     * Get the current drawer for the marker.
     *
     * @returns The object in charge of drawing the marker.
     */
    getDrawer() {
        return this.drawer;
    }
    /**
     * Gets the current location of the marker.
     *
     * @returns The current field, connection, or block the marker is on.
     */
    getCurNode() {
        return this.curNode;
    }
    /**
     * Set the location of the marker and call the update method.
     * Setting isStack to true will only work if the newLocation is the top most
     * output or previous connection on a stack.
     *
     * @param newNode The new location of the marker.
     */
    setCurNode(newNode) {
        const oldNode = this.curNode;
        this.curNode = newNode;
        if (this.drawer) {
            this.drawer.draw(oldNode, this.curNode);
        }
    }
    /**
     * Redraw the current marker.
     *
     * @internal
     */
    draw() {
        if (this.drawer) {
            this.drawer.draw(this.curNode, this.curNode);
        }
    }
    /** Hide the marker SVG. */
    hide() {
        if (this.drawer) {
            this.drawer.hide();
        }
    }
    /** Dispose of this marker. */
    dispose() {
        if (this.getDrawer()) {
            this.getDrawer().dispose();
        }
    }
}
//# sourceMappingURL=marker.js.map