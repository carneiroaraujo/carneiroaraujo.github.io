/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.utils.dom');
/**
 * Required name space for SVG elements.
 */
export const SVG_NS = 'http://www.w3.org/2000/svg';
/**
 * Required name space for HTML elements.
 */
export const HTML_NS = 'http://www.w3.org/1999/xhtml';
/**
 * Required name space for XLINK elements.
 */
export const XLINK_NS = 'http://www.w3.org/1999/xlink';
/**
 * Node type constants.
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
 */
export var NodeType;
(function (NodeType) {
    NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
    NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    NodeType[NodeType["DOCUMENT_POSITION_CONTAINED_BY"] = 16] = "DOCUMENT_POSITION_CONTAINED_BY";
})(NodeType || (NodeType = {}));
/** Temporary cache of text widths. */
let cacheWidths = null;
/** Number of current references to cache. */
let cacheReference = 0;
/** A HTML canvas context used for computing text width. */
let canvasContext = null;
/**
 * Helper method for creating SVG elements.
 *
 * @param name Element's tag name.
 * @param attrs Dictionary of attribute names and values.
 * @param opt_parent Optional parent on which to append the element.
 * @returns if name is a string or a more specific type if it a member of Svg.
 */
export function createSvgElement(name, attrs, opt_parent) {
    const e = document.createElementNS(SVG_NS, `${name}`);
    for (const key in attrs) {
        e.setAttribute(key, `${attrs[key]}`);
    }
    if (opt_parent) {
        opt_parent.appendChild(e);
    }
    return e;
}
/**
 * Add a CSS class to a element.
 *
 * Handles multiple space-separated classes for legacy reasons.
 *
 * @param element DOM element to add class to.
 * @param className Name of class to add.
 * @returns True if class was added, false if already present.
 */
export function addClass(element, className) {
    const classNames = className.split(' ');
    if (classNames.every((name) => element.classList.contains(name))) {
        return false;
    }
    element.classList.add(...classNames);
    return true;
}
/**
 * Removes multiple classes from an element.
 *
 * @param element DOM element to remove classes from.
 * @param classNames A string of one or multiple class names for an element.
 */
export function removeClasses(element, classNames) {
    element.classList.remove(...classNames.split(' '));
}
/**
 * Remove a CSS class from a element.
 *
 * Handles multiple space-separated classes for legacy reasons.
 *
 * @param element DOM element to remove class from.
 * @param className Name of class to remove.
 * @returns True if class was removed, false if never present.
 */
export function removeClass(element, className) {
    const classNames = className.split(' ');
    if (classNames.every((name) => !element.classList.contains(name))) {
        return false;
    }
    element.classList.remove(...classNames);
    return true;
}
/**
 * Checks if an element has the specified CSS class.
 *
 * @param element DOM element to check.
 * @param className Name of class to check.
 * @returns True if class exists, false otherwise.
 */
export function hasClass(element, className) {
    return element.classList.contains(className);
}
/**
 * Removes a node from its parent. No-op if not attached to a parent.
 *
 * @param node The node to remove.
 * @returns The node removed if removed; else, null.
 */
// Copied from Closure goog.dom.removeNode
export function removeNode(node) {
    return node && node.parentNode ? node.parentNode.removeChild(node) : null;
}
/**
 * Insert a node after a reference node.
 * Contrast with node.insertBefore function.
 *
 * @param newNode New element to insert.
 * @param refNode Existing element to precede new node.
 */
export function insertAfter(newNode, refNode) {
    const siblingNode = refNode.nextSibling;
    const parentNode = refNode.parentNode;
    if (!parentNode) {
        throw Error('Reference node has no parent.');
    }
    if (siblingNode) {
        parentNode.insertBefore(newNode, siblingNode);
    }
    else {
        parentNode.appendChild(newNode);
    }
}
/**
 * Whether a node contains another node.
 *
 * @param parent The node that should contain the other node.
 * @param descendant The node to test presence of.
 * @returns Whether the parent node contains the descendant node.
 */
export function containsNode(parent, descendant) {
    return !!(parent.compareDocumentPosition(descendant) &
        NodeType.DOCUMENT_POSITION_CONTAINED_BY);
}
/**
 * Sets the CSS transform property on an element. This function sets the
 * non-vendor-prefixed and vendor-prefixed versions for backwards compatibility
 * with older browsers. See https://caniuse.com/#feat=transforms2d
 *
 * @param element Element to which the CSS transform will be applied.
 * @param transform The value of the CSS `transform` property.
 */
export function setCssTransform(element, transform) {
    element.style['transform'] = transform;
    element.style['-webkit-transform'] = transform;
}
/**
 * Start caching text widths. Every call to this function MUST also call
 * stopTextWidthCache. Caches must not survive between execution threads.
 */
export function startTextWidthCache() {
    cacheReference++;
    if (!cacheWidths) {
        cacheWidths = Object.create(null);
    }
}
/**
 * Stop caching field widths. Unless caching was already on when the
 * corresponding call to startTextWidthCache was made.
 */
export function stopTextWidthCache() {
    cacheReference--;
    if (!cacheReference) {
        cacheWidths = null;
    }
}
/**
 * Gets the width of a text element, caching it in the process.
 *
 * @param textElement An SVG 'text' element.
 * @returns Width of element.
 */
export function getTextWidth(textElement) {
    const key = textElement.textContent + '\n' + textElement.className.baseVal;
    let width;
    // Return the cached width if it exists.
    if (cacheWidths) {
        width = cacheWidths[key];
        if (width) {
            return width;
        }
    }
    // Attempt to compute fetch the width of the SVG text element.
    try {
        width = textElement.getComputedTextLength();
    }
    catch (e) {
        // In other cases where we fail to get the computed text. Instead, use an
        // approximation and do not cache the result. At some later point in time
        // when the block is inserted into the visible DOM, this method will be
        // called again and, at that point in time, will not throw an exception.
        return textElement.textContent.length * 8;
    }
    // Cache the computed width and return.
    if (cacheWidths) {
        cacheWidths[key] = width;
    }
    return width;
}
/**
 * Gets the width of a text element using a faster method than `getTextWidth`.
 * This method requires that we know the text element's font family and size in
 * advance. Similar to `getTextWidth`, we cache the width we compute.
 *
 * @param textElement An SVG 'text' element.
 * @param fontSize The font size to use.
 * @param fontWeight The font weight to use.
 * @param fontFamily The font family to use.
 * @returns Width of element.
 */
export function getFastTextWidth(textElement, fontSize, fontWeight, fontFamily) {
    return getFastTextWidthWithSizeString(textElement, fontSize + 'pt', fontWeight, fontFamily);
}
/**
 * Gets the width of a text element using a faster method than `getTextWidth`.
 * This method requires that we know the text element's font family and size in
 * advance. Similar to `getTextWidth`, we cache the width we compute.
 * This method is similar to `getFastTextWidth` but expects the font size
 * parameter to be a string.
 *
 * @param textElement An SVG 'text' element.
 * @param fontSize The font size to use.
 * @param fontWeight The font weight to use.
 * @param fontFamily The font family to use.
 * @returns Width of element.
 */
export function getFastTextWidthWithSizeString(textElement, fontSize, fontWeight, fontFamily) {
    const text = textElement.textContent;
    const key = text + '\n' + textElement.className.baseVal;
    let width;
    // Return the cached width if it exists.
    if (cacheWidths) {
        width = cacheWidths[key];
        if (width) {
            return width;
        }
    }
    if (!canvasContext) {
        // Inject the canvas element used for computing text widths.
        const computeCanvas = (document.createElement('canvas'));
        computeCanvas.className = 'blocklyComputeCanvas';
        document.body.appendChild(computeCanvas);
        // Initialize the HTML canvas context and set the font.
        // The context font must match blocklyText's fontsize and font-family
        // set in CSS.
        canvasContext = computeCanvas.getContext('2d');
    }
    // Set the desired font size and family.
    canvasContext.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
    // Measure the text width using the helper canvas context.
    if (text) {
        width = canvasContext.measureText(text).width;
    }
    else {
        width = 0;
    }
    // Cache the computed width and return.
    if (cacheWidths) {
        cacheWidths[key] = width;
    }
    return width;
}
/**
 * Measure a font's metrics. The height and baseline values.
 *
 * @param text Text to measure the font dimensions of.
 * @param fontSize The font size to use.
 * @param fontWeight The font weight to use.
 * @param fontFamily The font family to use.
 * @returns Font measurements.
 */
export function measureFontMetrics(text, fontSize, fontWeight, fontFamily) {
    const span = (document.createElement('span'));
    span.style.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
    span.textContent = text;
    const block = (document.createElement('div'));
    block.style.width = '1px';
    block.style.height = '0';
    const div = (document.createElement('div'));
    div.setAttribute('style', 'position: fixed; top: 0; left: 0; display: flex;');
    div.appendChild(span);
    div.appendChild(block);
    document.body.appendChild(div);
    const result = {
        height: 0,
        baseline: 0,
    };
    try {
        div.style.alignItems = 'baseline';
        result.baseline = block.offsetTop - span.offsetTop;
        div.style.alignItems = 'flex-end';
        result.height = block.offsetTop - span.offsetTop;
    }
    finally {
        document.body.removeChild(div);
    }
    return result;
}
//# sourceMappingURL=dom.js.map