/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Defines the Svg class. Its constants enumerate
 * all SVG tag names used by Blockly.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.utils.Svg');
/**
 * A name with the type of the SVG element stored in the generic.
 */
class Svg {
    /**
     * @param tagName The SVG element tag name.
     * @internal
     */
    constructor(tagName) {
        this.tagName = tagName;
    }
    /**
     * Returns the SVG element tag name.
     *
     * @returns The name.
     */
    toString() {
        return this.tagName;
    }
}
/** @internal */
Svg.ANIMATE = new Svg('animate');
/** @internal */
Svg.CIRCLE = new Svg('circle');
/** @internal */
Svg.CLIPPATH = new Svg('clipPath');
/** @internal */
Svg.DEFS = new Svg('defs');
/** @internal */
Svg.FECOMPOSITE = new Svg('feComposite');
/** @internal */
Svg.FECOMPONENTTRANSFER = new Svg('feComponentTransfer');
/** @internal */
Svg.FEFLOOD = new Svg('feFlood');
/** @internal */
Svg.FEFUNCA = new Svg('feFuncA');
/** @internal */
Svg.FEGAUSSIANBLUR = new Svg('feGaussianBlur');
/** @internal */
Svg.FEPOINTLIGHT = new Svg('fePointLight');
/** @internal */
Svg.FESPECULARLIGHTING = new Svg('feSpecularLighting');
/** @internal */
Svg.FILTER = new Svg('filter');
/** @internal */
Svg.FOREIGNOBJECT = new Svg('foreignObject');
/** @internal */
Svg.G = new Svg('g');
/** @internal */
Svg.IMAGE = new Svg('image');
/** @internal */
Svg.LINE = new Svg('line');
/** @internal */
Svg.PATH = new Svg('path');
/** @internal */
Svg.PATTERN = new Svg('pattern');
/** @internal */
Svg.POLYGON = new Svg('polygon');
/** @internal */
Svg.RECT = new Svg('rect');
/** @internal */
Svg.SVG = new Svg('svg');
/** @internal */
Svg.TEXT = new Svg('text');
/** @internal */
Svg.TSPAN = new Svg('tspan');
export { Svg };
//# sourceMappingURL=svg.js.map