/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.zelos.MarkerSvg');
import * as dom from '../../utils/dom.js';
import { Svg } from '../../utils/svg.js';
import { MarkerSvg as BaseMarkerSvg } from '../common/marker_svg.js';
/**
 * Class to draw a marker.
 */
export class MarkerSvg extends BaseMarkerSvg {
    /**
     * @param workspace The workspace the marker belongs to.
     * @param constants The constants for the renderer.
     * @param marker The marker to draw.
     */
    constructor(workspace, constants, marker) {
        super(workspace, constants, marker);
        this.markerCircle = null;
    }
    /**
     * Position and display the marker for an input or an output connection.
     *
     * @param curNode The node to draw the marker for.
     */
    showWithInputOutput(curNode) {
        const block = curNode.getSourceBlock();
        const connection = curNode.getLocation();
        const offsetInBlock = connection.getOffsetInBlock();
        this.positionCircle(offsetInBlock.x, offsetInBlock.y);
        this.setParent_(block);
        this.showCurrent_();
    }
    showWithOutput_(curNode) {
        this.showWithInputOutput(curNode);
    }
    showWithInput_(curNode) {
        this.showWithInputOutput(curNode);
    }
    /**
     * Draw a rectangle around the block.
     *
     * @param curNode The current node of the marker.
     */
    showWithBlock_(curNode) {
        const block = curNode.getLocation();
        // Gets the height and width of entire stack.
        const heightWidth = block.getHeightWidth();
        // Add padding so that being on a stack looks different than being on a
        // block.
        this.positionRect_(0, 0, heightWidth.width, heightWidth.height);
        this.setParent_(block);
        this.showCurrent_();
    }
    /**
     * Position the circle we use for input and output connections.
     *
     * @param x The x position of the circle.
     * @param y The y position of the circle.
     */
    positionCircle(x, y) {
        this.markerCircle?.setAttribute('cx', `${x}`);
        this.markerCircle?.setAttribute('cy', `${y}`);
        this.currentMarkerSvg = this.markerCircle;
    }
    hide() {
        super.hide();
        if (this.markerCircle) {
            this.markerCircle.style.display = 'none';
        }
    }
    createDomInternal_() {
        /* clang-format off */
        /* This markup will be generated and added to the .svgGroup_:
            <g>
              <rect width="100" height="5">
                <animate attributeType="XML" attributeName="fill" dur="1s"
                  values="transparent;transparent;#fff;transparent" repeatCount="indefinite" />
              </rect>
            </g>
            */
        /* clang-format on */
        super.createDomInternal_();
        this.markerCircle = dom.createSvgElement(Svg.CIRCLE, {
            'r': this.constants_.CURSOR_RADIUS,
            'style': 'display: none',
            'stroke-width': this.constants_.CURSOR_STROKE_WIDTH,
        }, this.markerSvg_);
        // Markers and stack cursors don't blink.
        if (this.isCursor()) {
            const blinkProperties = this.getBlinkProperties_();
            dom.createSvgElement(Svg.ANIMATE, blinkProperties, this.markerCircle);
        }
        return this.markerSvg_;
    }
    applyColour_(curNode) {
        super.applyColour_(curNode);
        this.markerCircle?.setAttribute('fill', this.colour_);
        this.markerCircle?.setAttribute('stroke', this.colour_);
        if (this.isCursor()) {
            const values = this.colour_ + ';transparent;transparent;';
            this.markerCircle?.firstElementChild.setAttribute('values', values);
        }
    }
}
//# sourceMappingURL=marker_svg.js.map