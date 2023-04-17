/**
 * @license
 * Copyright 2011 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.Tooltip');
import * as browserEvents from './browser_events.js';
import * as common from './common.js';
import * as blocklyString from './utils/string.js';
/**
 * An optional function that renders custom tooltips into the provided DIV. If
 * this is defined, the function will be called instead of rendering the default
 * tooltip UI.
 */
let customTooltip = undefined;
/**
 * Sets a custom function that will be called if present instead of the default
 * tooltip UI.
 *
 * @param customFn A custom tooltip used to render an alternate tooltip UI.
 */
export function setCustomTooltip(customFn) {
    customTooltip = customFn;
}
/**
 * Gets the custom tooltip function.
 *
 * @returns The custom tooltip function, if defined.
 */
export function getCustomTooltip() {
    return customTooltip;
}
/** Is a tooltip currently showing? */
let visible = false;
/**
 * Returns whether or not a tooltip is showing
 *
 * @returns True if a tooltip is showing
 */
export function isVisible() {
    return visible;
}
/** Is someone else blocking the tooltip from being shown? */
let blocked = false;
/**
 * Maximum width (in characters) of a tooltip.
 */
export const LIMIT = 50;
/** PID of suspended thread to clear tooltip on mouse out. */
let mouseOutPid = 0;
/** PID of suspended thread to show the tooltip. */
let showPid = 0;
/**
 * Last observed X location of the mouse pointer (freezes when tooltip appears).
 */
let lastX = 0;
/**
 * Last observed Y location of the mouse pointer (freezes when tooltip appears).
 */
let lastY = 0;
/** Current element being pointed at. */
let element = null;
/**
 * Once a tooltip has opened for an element, that element is 'poisoned' and
 * cannot respawn a tooltip until the pointer moves over a different element.
 */
let poisonedElement = null;
/**
 * Horizontal offset between mouse cursor and tooltip.
 */
export const OFFSET_X = 0;
/**
 * Vertical offset between mouse cursor and tooltip.
 */
export const OFFSET_Y = 10;
/**
 * Radius mouse can move before killing tooltip.
 */
export const RADIUS_OK = 10;
/**
 * Delay before tooltip appears.
 */
export const HOVER_MS = 750;
/**
 * Horizontal padding between tooltip and screen edge.
 */
export const MARGINS = 5;
/** The HTML container.  Set once by createDom. */
let containerDiv = null;
/**
 * Returns the HTML tooltip container.
 *
 * @returns The HTML tooltip container.
 */
export function getDiv() {
    return containerDiv;
}
/**
 * Returns the tooltip text for the given element.
 *
 * @param object The object to get the tooltip text of.
 * @returns The tooltip text of the element.
 */
export function getTooltipOfObject(object) {
    const obj = getTargetObject(object);
    if (obj) {
        let tooltip = obj.tooltip;
        while (typeof tooltip === 'function') {
            tooltip = tooltip();
        }
        if (typeof tooltip !== 'string') {
            throw Error('Tooltip function must return a string.');
        }
        return tooltip;
    }
    return '';
}
/**
 * Returns the target object that the given object is targeting for its
 * tooltip. Could be the object itself.
 *
 * @param obj The object are trying to find the target tooltip object of.
 * @returns The target tooltip object.
 */
function getTargetObject(obj) {
    while (obj && obj.tooltip) {
        if (typeof obj.tooltip === 'string' ||
            typeof obj.tooltip === 'function') {
            return obj;
        }
        obj = obj.tooltip;
    }
    return null;
}
/**
 * Create the tooltip div and inject it onto the page.
 */
export function createDom() {
    if (containerDiv) {
        return; // Already created.
    }
    // Create an HTML container for popup overlays (e.g. editor widgets).
    containerDiv = document.createElement('div');
    containerDiv.className = 'blocklyTooltipDiv';
    const container = common.getParentContainer() || document.body;
    container.appendChild(containerDiv);
}
/**
 * Binds the required mouse events onto an SVG element.
 *
 * @param element SVG element onto which tooltip is to be bound.
 */
export function bindMouseEvents(element) {
    // TODO (#6097): Don't stash wrapper info on the DOM.
    element.mouseOverWrapper_ =
        browserEvents.bind(element, 'pointerover', null, onMouseOver);
    element.mouseOutWrapper_ =
        browserEvents.bind(element, 'pointerout', null, onMouseOut);
    // Don't use bindEvent_ for mousemove since that would create a
    // corresponding touch handler, even though this only makes sense in the
    // context of a mouseover/mouseout.
    element.addEventListener('pointermove', onMouseMove, false);
}
/**
 * Unbinds tooltip mouse events from the SVG element.
 *
 * @param element SVG element onto which tooltip is bound.
 */
export function unbindMouseEvents(element) {
    if (!element) {
        return;
    }
    // TODO (#6097): Don't stash wrapper info on the DOM.
    browserEvents.unbind(element.mouseOverWrapper_);
    browserEvents.unbind(element.mouseOutWrapper_);
    element.removeEventListener('pointermove', onMouseMove);
}
/**
 * Hide the tooltip if the mouse is over a different object.
 * Initialize the tooltip to potentially appear for this object.
 *
 * @param e Mouse event.
 */
function onMouseOver(e) {
    if (blocked) {
        // Someone doesn't want us to show tooltips.
        return;
    }
    // If the tooltip is an object, treat it as a pointer to the next object in
    // the chain to look at.  Terminate when a string or function is found.
    const newElement = getTargetObject(e.currentTarget);
    if (element !== newElement) {
        hide();
        poisonedElement = null;
        element = newElement;
    }
    // Forget about any immediately preceding mouseOut event.
    clearTimeout(mouseOutPid);
}
/**
 * Hide the tooltip if the mouse leaves the object and enters the workspace.
 *
 * @param _e Mouse event.
 */
function onMouseOut(_e) {
    if (blocked) {
        // Someone doesn't want us to show tooltips.
        return;
    }
    // Moving from one element to another (overlapping or with no gap) generates
    // a mouseOut followed instantly by a mouseOver.  Fork off the mouseOut
    // event and kill it if a mouseOver is received immediately.
    // This way the task only fully executes if mousing into the void.
    mouseOutPid = setTimeout(function () {
        element = null;
        poisonedElement = null;
        hide();
    }, 1);
    clearTimeout(showPid);
    showPid = 0;
}
/**
 * When hovering over an element, schedule a tooltip to be shown.  If a tooltip
 * is already visible, hide it if the mouse strays out of a certain radius.
 *
 * @param e Mouse event.
 */
function onMouseMove(e) {
    if (!element || !element.tooltip) {
        // No tooltip here to show.
        return;
    }
    else if (blocked) {
        // Someone doesn't want us to show tooltips.  We are probably handling a
        // user gesture, such as a click or drag.
        return;
    }
    if (visible) {
        // Compute the distance between the mouse position when the tooltip was
        // shown and the current mouse position.  Pythagorean theorem.
        // AnyDuringMigration because:  Property 'pageX' does not exist on type
        // 'Event'.
        const dx = lastX - e.pageX;
        // AnyDuringMigration because:  Property 'pageY' does not exist on type
        // 'Event'.
        const dy = lastY - e.pageY;
        if (Math.sqrt(dx * dx + dy * dy) > RADIUS_OK) {
            hide();
        }
    }
    else if (poisonedElement !== element) {
        // The mouse moved, clear any previously scheduled tooltip.
        clearTimeout(showPid);
        // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
        // AnyDuringMigration because:  Property 'pageX' does not exist on type
        // 'Event'.
        lastX = e.pageX;
        // AnyDuringMigration because:  Property 'pageY' does not exist on type
        // 'Event'.
        lastY = e.pageY;
        showPid = setTimeout(show, HOVER_MS);
    }
}
/**
 * Dispose of the tooltip.
 *
 * @internal
 */
export function dispose() {
    element = null;
    poisonedElement = null;
    hide();
}
/**
 * Hide the tooltip.
 */
export function hide() {
    if (visible) {
        visible = false;
        if (containerDiv) {
            containerDiv.style.display = 'none';
        }
    }
    if (showPid) {
        clearTimeout(showPid);
        showPid = 0;
    }
}
/**
 * Hide any in-progress tooltips and block showing new tooltips until the next
 * call to unblock().
 *
 * @internal
 */
export function block() {
    hide();
    blocked = true;
}
/**
 * Unblock tooltips: allow them to be scheduled and shown according to their own
 * logic.
 *
 * @internal
 */
export function unblock() {
    blocked = false;
}
/** Renders the tooltip content into the tooltip div. */
function renderContent() {
    if (!containerDiv || !element) {
        // This shouldn't happen, but if it does, we can't render.
        return;
    }
    if (typeof customTooltip === 'function') {
        customTooltip(containerDiv, element);
    }
    else {
        renderDefaultContent();
    }
}
/** Renders the default tooltip UI. */
function renderDefaultContent() {
    let tip = getTooltipOfObject(element);
    tip = blocklyString.wrap(tip, LIMIT);
    // Create new text, line by line.
    const lines = tip.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const div = (document.createElement('div'));
        div.appendChild(document.createTextNode(lines[i]));
        containerDiv.appendChild(div);
    }
}
/**
 * Gets the coordinates for the tooltip div, taking into account the edges of
 * the screen to prevent showing the tooltip offscreen.
 *
 * @param rtl True if the tooltip should be in right-to-left layout.
 * @returns Coordinates at which the tooltip div should be placed.
 */
function getPosition(rtl) {
    // Position the tooltip just below the cursor.
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    let anchorX = lastX;
    if (rtl) {
        anchorX -= OFFSET_X + containerDiv.offsetWidth;
    }
    else {
        anchorX += OFFSET_X;
    }
    let anchorY = lastY + OFFSET_Y;
    if (anchorY + containerDiv.offsetHeight > windowHeight + window.scrollY) {
        // Falling off the bottom of the screen; shift the tooltip up.
        anchorY -= containerDiv.offsetHeight + 2 * OFFSET_Y;
    }
    if (rtl) {
        // Prevent falling off left edge in RTL mode.
        anchorX = Math.max(MARGINS - window.scrollX, anchorX);
    }
    else {
        if (anchorX + containerDiv.offsetWidth >
            windowWidth + window.scrollX - 2 * MARGINS) {
            // Falling off the right edge of the screen;
            // clamp the tooltip on the edge.
            anchorX = windowWidth - containerDiv.offsetWidth - 2 * MARGINS;
        }
    }
    return { x: anchorX, y: anchorY };
}
/** Create the tooltip and show it. */
function show() {
    if (blocked) {
        // Someone doesn't want us to show tooltips.
        return;
    }
    poisonedElement = element;
    if (!containerDiv) {
        return;
    }
    // Erase all existing text.
    containerDiv.textContent = '';
    // Add new content.
    renderContent();
    // Display the tooltip.
    const rtl = element.RTL;
    containerDiv.style.direction = rtl ? 'rtl' : 'ltr';
    containerDiv.style.display = 'block';
    visible = true;
    const { x, y } = getPosition(rtl);
    containerDiv.style.left = x + 'px';
    containerDiv.style.top = y + 'px';
}
//# sourceMappingURL=tooltip.js.map