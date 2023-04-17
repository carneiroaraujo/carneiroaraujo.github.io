/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.thrasos.Renderer');
import * as blockRendering from '../common/block_rendering.js';
import { Renderer as BaseRenderer } from '../common/renderer.js';
import { RenderInfo } from './info.js';
/**
 * The thrasos renderer. This is a more modern take on the legacy geras
 * renderer.
 *
 * Thrasos is the ancient Greek spirit of boldness.
 */
export class Renderer extends BaseRenderer {
    /**
     * @param name The renderer name.
     */
    constructor(name) {
        super(name);
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
}
blockRendering.register('thrasos', Renderer);
//# sourceMappingURL=renderer.js.map