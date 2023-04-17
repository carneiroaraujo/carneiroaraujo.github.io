/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.zelos.Renderer');
import { ConnectionType } from '../../connection_type.js';
import { InsertionMarkerManager } from '../../insertion_marker_manager.js';
import * as blockRendering from '../common/block_rendering.js';
import { Renderer as BaseRenderer } from '../common/renderer.js';
import { ConstantProvider } from './constants.js';
import { Drawer } from './drawer.js';
import { RenderInfo } from './info.js';
import { MarkerSvg } from './marker_svg.js';
import { PathObject } from './path_object.js';
/**
 * The zelos renderer. This renderer emulates Scratch-style and MakeCode-style
 * rendering.
 *
 * Zelos is the ancient Greek spirit of rivalry and emulation.
 */
export class Renderer extends BaseRenderer {
    /**
     * @param name The renderer name.
     */
    constructor(name) {
        super(name);
    }
    /**
     * Create a new instance of the renderer's constant provider.
     *
     * @returns The constant provider.
     */
    makeConstants_() {
        return new ConstantProvider();
    }
    /**
     * Create a new instance of the renderer's render info object.
     *
     * @param block The block to measure.
     * @returns The render info object.
     */
    makeRenderInfo_(block) {
        return new RenderInfo(this, block);
    }
    /**
     * Create a new instance of the renderer's drawer.
     *
     * @param block The block to render.
     * @param info An object containing all information needed to render this
     *     block.
     * @returns The drawer.
     */
    makeDrawer_(block, info) {
        return new Drawer(block, info);
    }
    /**
     * Create a new instance of the renderer's cursor drawer.
     *
     * @param workspace The workspace the cursor belongs to.
     * @param marker The marker.
     * @returns The object in charge of drawing the marker.
     */
    makeMarkerDrawer(workspace, marker) {
        return new MarkerSvg(workspace, this.getConstants(), marker);
    }
    /**
     * Create a new instance of a renderer path object.
     *
     * @param root The root SVG element.
     * @param style The style object to use for colouring.
     * @returns The renderer path object.
     */
    makePathObject(root, style) {
        return new PathObject(root, style, this.getConstants());
    }
    /**
     * Get the current renderer's constant provider.  We assume that when this is
     * called, the renderer has already been initialized.
     *
     * @returns The constant provider.
     */
    getConstants() {
        return this.constants_;
    }
    shouldHighlightConnection(conn) {
        return conn.type !== ConnectionType.INPUT_VALUE &&
            conn.type !== ConnectionType.OUTPUT_VALUE;
    }
    getConnectionPreviewMethod(closest, local, topBlock) {
        if (local.type === ConnectionType.OUTPUT_VALUE) {
            if (!closest.isConnected()) {
                return InsertionMarkerManager.PREVIEW_TYPE.INPUT_OUTLINE;
            }
            // TODO: Returning this is a total hack, because we don't want to show
            //   a replacement fade, we want to show an outline affect.
            //   Sadly zelos does not support showing an outline around filled
            //   inputs, so we have to pretend like the connected block is getting
            //   replaced.
            return InsertionMarkerManager.PREVIEW_TYPE.REPLACEMENT_FADE;
        }
        return super.getConnectionPreviewMethod(closest, local, topBlock);
    }
}
blockRendering.register('zelos', Renderer);
//# sourceMappingURL=renderer.js.map