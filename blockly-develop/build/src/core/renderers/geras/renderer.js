/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.geras.Renderer');
import * as blockRendering from '../common/block_rendering.js';
import { Renderer as BaseRenderer } from '../common/renderer.js';
import { ConstantProvider } from './constants.js';
import { Drawer } from './drawer.js';
import { HighlightConstantProvider } from './highlight_constants.js';
import { RenderInfo } from './info.js';
import { PathObject } from './path_object.js';
/**
 * The geras renderer. This renderer was designed to be backwards compatible
 * with pre-2019 Blockly. Newer projects that are not constrained by backwards
 * compatibility should use thrasos, which is a more modern take on this
 * renderer.
 *
 * Geras is the ancient Greek spirit of old age.
 */
export class Renderer extends BaseRenderer {
    /**
     * @param name The renderer name.
     */
    constructor(name) {
        super(name);
        /** The renderer's highlight constant provider. */
        this.highlightConstants = null;
    }
    /**
     * Initialize the renderer.  Geras has a highlight provider in addition to
     * the normal constant provider.
     */
    init(theme, opt_rendererOverrides) {
        super.init(theme, opt_rendererOverrides);
        this.highlightConstants = this.makeHighlightConstants_();
        this.highlightConstants.init();
    }
    refreshDom(svg, theme) {
        super.refreshDom(svg, theme);
        this.getHighlightConstants().init();
    }
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
     * Create a new instance of the renderer's highlight constant provider.
     *
     * @returns The highlight constant provider.
     */
    makeHighlightConstants_() {
        return new HighlightConstantProvider((this.getConstants()));
    }
    /**
     * Get the renderer's highlight constant provider.  We assume that when this
     * is called, the renderer has already been initialized.
     *
     * @returns The highlight constant provider.
     */
    getHighlightConstants() {
        if (!this.highlightConstants) {
            throw new Error('Cannot access the highlight constants because init has not ' +
                'been called');
        }
        return this.highlightConstants;
    }
}
blockRendering.register('geras', Renderer);
//# sourceMappingURL=renderer.js.map