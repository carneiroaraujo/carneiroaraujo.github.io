/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Object in charge of managing markers and the cursor.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.MarkerManager');
/**
 * Class to manage the multiple markers and the cursor on a workspace.
 */
class MarkerManager {
    /**
     * @param workspace The workspace for the marker manager.
     * @internal
     */
    constructor(workspace) {
        this.workspace = workspace;
        /** The cursor. */
        this.cursor_ = null;
        /** The cursor's SVG element. */
        this.cursorSvg_ = null;
        /** The map of markers for the workspace. */
        this.markers = new Map();
        /** The marker's SVG element. */
        this.markerSvg_ = null;
    }
    /**
     * Register the marker by adding it to the map of markers.
     *
     * @param id A unique identifier for the marker.
     * @param marker The marker to register.
     */
    registerMarker(id, marker) {
        if (this.markers.has(id)) {
            this.unregisterMarker(id);
        }
        marker.setDrawer(this.workspace.getRenderer().makeMarkerDrawer(this.workspace, marker));
        this.setMarkerSvg(marker.getDrawer().createDom());
        this.markers.set(id, marker);
    }
    /**
     * Unregister the marker by removing it from the map of markers.
     *
     * @param id The ID of the marker to unregister.
     */
    unregisterMarker(id) {
        const marker = this.markers.get(id);
        if (marker) {
            marker.dispose();
            this.markers.delete(id);
        }
        else {
            throw Error('Marker with ID ' + id + ' does not exist. ' +
                'Can only unregister markers that exist.');
        }
    }
    /**
     * Get the cursor for the workspace.
     *
     * @returns The cursor for this workspace.
     */
    getCursor() {
        return this.cursor_;
    }
    /**
     * Get a single marker that corresponds to the given ID.
     *
     * @param id A unique identifier for the marker.
     * @returns The marker that corresponds to the given ID, or null if none
     *     exists.
     */
    getMarker(id) {
        return this.markers.get(id) || null;
    }
    /**
     * Sets the cursor and initializes the drawer for use with keyboard
     * navigation.
     *
     * @param cursor The cursor used to move around this workspace.
     */
    setCursor(cursor) {
        if (this.cursor_ && this.cursor_.getDrawer()) {
            this.cursor_.getDrawer().dispose();
        }
        this.cursor_ = cursor;
        if (this.cursor_) {
            const drawer = this.workspace.getRenderer().makeMarkerDrawer(this.workspace, this.cursor_);
            this.cursor_.setDrawer(drawer);
            this.setCursorSvg(this.cursor_.getDrawer().createDom());
        }
    }
    /**
     * Add the cursor SVG to this workspace SVG group.
     *
     * @param cursorSvg The SVG root of the cursor to be added to the workspace
     *     SVG group.
     * @internal
     */
    setCursorSvg(cursorSvg) {
        if (!cursorSvg) {
            this.cursorSvg_ = null;
            return;
        }
        this.workspace.getBlockCanvas().appendChild(cursorSvg);
        this.cursorSvg_ = cursorSvg;
    }
    /**
     * Add the marker SVG to this workspaces SVG group.
     *
     * @param markerSvg The SVG root of the marker to be added to the workspace
     *     SVG group.
     * @internal
     */
    setMarkerSvg(markerSvg) {
        if (!markerSvg) {
            this.markerSvg_ = null;
            return;
        }
        if (this.workspace.getBlockCanvas()) {
            if (this.cursorSvg_) {
                this.workspace.getBlockCanvas().insertBefore(markerSvg, this.cursorSvg_);
            }
            else {
                this.workspace.getBlockCanvas().appendChild(markerSvg);
            }
        }
    }
    /**
     * Redraw the attached cursor SVG if needed.
     *
     * @internal
     */
    updateMarkers() {
        if (this.workspace.keyboardAccessibilityMode && this.cursorSvg_) {
            this.workspace.getCursor().draw();
        }
    }
    /**
     * Dispose of the marker manager.
     * Go through and delete all markers associated with this marker manager.
     *
     * @suppress {checkTypes}
     * @internal
     */
    dispose() {
        const markerIds = Object.keys(this.markers);
        for (let i = 0, markerId; markerId = markerIds[i]; i++) {
            this.unregisterMarker(markerId);
        }
        this.markers.clear();
        if (this.cursor_) {
            this.cursor_.dispose();
            this.cursor_ = null;
        }
    }
}
/** The name of the local marker. */
MarkerManager.LOCAL_MARKER = 'local_marker_1';
export { MarkerManager };
//# sourceMappingURL=marker_manager.js.map