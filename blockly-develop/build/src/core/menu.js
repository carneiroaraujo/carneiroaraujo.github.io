/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Blockly menu similar to Closure's goog.ui.Menu
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.Menu');
import * as browserEvents from './browser_events.js';
import * as aria from './utils/aria.js';
import { Coordinate } from './utils/coordinate.js';
import * as dom from './utils/dom.js';
import * as style from './utils/style.js';
/**
 * A basic menu class.
 */
export class Menu {
    /** Constructs a new Menu instance. */
    constructor() {
        /**
         * Array of menu items.
         * (Nulls are never in the array, but typing the array as nullable prevents
         * the compiler from objecting to .indexOf(null))
         */
        this.menuItems = [];
        /**
         * Coordinates of the mousedown event that caused this menu to open. Used to
         * prevent the consequent mouseup event due to a simple click from
         * activating a menu item immediately.
         */
        this.openingCoords = null;
        /**
         * This is the element that we will listen to the real focus events on.
         * A value of null means no menu item is highlighted.
         */
        this.highlightedItem = null;
        /** Mouse over event data. */
        this.mouseOverHandler = null;
        /** Click event data. */
        this.clickHandler = null;
        /** Mouse enter event data. */
        this.mouseEnterHandler = null;
        /** Mouse leave event data. */
        this.mouseLeaveHandler = null;
        /** Key down event data. */
        this.onKeyDownHandler = null;
        /** The menu's root DOM element. */
        this.element = null;
        /** ARIA name for this menu. */
        this.roleName = null;
    }
    /**
     * Add a new menu item to the bottom of this menu.
     *
     * @param menuItem Menu item to append.
     * @internal
     */
    addChild(menuItem) {
        this.menuItems.push(menuItem);
    }
    /**
     * Creates the menu DOM.
     *
     * @param container Element upon which to append this menu.
     * @returns The menu's root DOM element.
     */
    render(container) {
        const element = (document.createElement('div'));
        // goog-menu is deprecated, use blocklyMenu.  May 2020.
        element.className = 'blocklyMenu goog-menu blocklyNonSelectable';
        element.tabIndex = 0;
        if (this.roleName) {
            aria.setRole(element, this.roleName);
        }
        this.element = element;
        // Add menu items.
        for (let i = 0, menuItem; menuItem = this.menuItems[i]; i++) {
            element.appendChild(menuItem.createDom());
        }
        // Add event handlers.
        this.mouseOverHandler = browserEvents.conditionalBind(element, 'pointerover', this, this.handleMouseOver, true);
        this.clickHandler = browserEvents.conditionalBind(element, 'pointerup', this, this.handleClick, true);
        this.mouseEnterHandler = browserEvents.conditionalBind(element, 'pointerenter', this, this.handleMouseEnter, true);
        this.mouseLeaveHandler = browserEvents.conditionalBind(element, 'pointerleave', this, this.handleMouseLeave, true);
        this.onKeyDownHandler = browserEvents.conditionalBind(element, 'keydown', this, this.handleKeyEvent);
        container.appendChild(element);
        return element;
    }
    /**
     * Gets the menu's element.
     *
     * @returns The DOM element.
     * @internal
     */
    getElement() {
        return this.element;
    }
    /**
     * Focus the menu element.
     *
     * @internal
     */
    focus() {
        const el = this.getElement();
        if (el) {
            el.focus({ preventScroll: true });
            dom.addClass(el, 'blocklyFocused');
        }
    }
    /** Blur the menu element. */
    blur() {
        const el = this.getElement();
        if (el) {
            el.blur();
            dom.removeClass(el, 'blocklyFocused');
        }
    }
    /**
     * Set the menu accessibility role.
     *
     * @param roleName role name.
     * @internal
     */
    setRole(roleName) {
        this.roleName = roleName;
    }
    /** Dispose of this menu. */
    dispose() {
        // Remove event handlers.
        if (this.mouseOverHandler) {
            browserEvents.unbind(this.mouseOverHandler);
            this.mouseOverHandler = null;
        }
        if (this.clickHandler) {
            browserEvents.unbind(this.clickHandler);
            this.clickHandler = null;
        }
        if (this.mouseEnterHandler) {
            browserEvents.unbind(this.mouseEnterHandler);
            this.mouseEnterHandler = null;
        }
        if (this.mouseLeaveHandler) {
            browserEvents.unbind(this.mouseLeaveHandler);
            this.mouseLeaveHandler = null;
        }
        if (this.onKeyDownHandler) {
            browserEvents.unbind(this.onKeyDownHandler);
            this.onKeyDownHandler = null;
        }
        // Remove menu items.
        for (let i = 0, menuItem; menuItem = this.menuItems[i]; i++) {
            menuItem.dispose();
        }
        this.element = null;
    }
    // Child component management.
    /**
     * Returns the child menu item that owns the given DOM element,
     * or null if no such menu item is found.
     *
     * @param elem DOM element whose owner is to be returned.
     * @returns Menu item for which the DOM element belongs to.
     */
    getMenuItem(elem) {
        const menuElem = this.getElement();
        // Node might be the menu border (resulting in no associated menu item), or
        // a menu item's div, or some element within the menu item.
        // Walk up parents until one meets either the menu's root element, or
        // a menu item's div.
        let currentElement = elem;
        while (currentElement && currentElement !== menuElem) {
            if (currentElement.classList.contains('blocklyMenuItem')) {
                // Having found a menu item's div, locate that menu item in this menu.
                for (let i = 0, menuItem; menuItem = this.menuItems[i]; i++) {
                    if (menuItem.getElement() === currentElement) {
                        return menuItem;
                    }
                }
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    }
    // Highlight management.
    /**
     * Highlights the given menu item, or clears highlighting if null.
     *
     * @param item Item to highlight, or null.
     * @internal
     */
    setHighlighted(item) {
        const currentHighlighted = this.highlightedItem;
        if (currentHighlighted) {
            currentHighlighted.setHighlighted(false);
            this.highlightedItem = null;
        }
        if (item) {
            item.setHighlighted(true);
            this.highlightedItem = item;
            // Bring the highlighted item into view. This has no effect if the menu is
            // not scrollable.
            const el = this.getElement();
            style.scrollIntoContainerView(item.getElement(), el);
            aria.setState(el, aria.State.ACTIVEDESCENDANT, item.getId());
        }
    }
    /**
     * Highlights the next highlightable item (or the first if nothing is
     * currently highlighted).
     *
     * @internal
     */
    highlightNext() {
        const index = this.highlightedItem ?
            this.menuItems.indexOf(this.highlightedItem) :
            -1;
        this.highlightHelper(index, 1);
    }
    /**
     * Highlights the previous highlightable item (or the last if nothing is
     * currently highlighted).
     *
     * @internal
     */
    highlightPrevious() {
        const index = this.highlightedItem ?
            this.menuItems.indexOf(this.highlightedItem) :
            -1;
        this.highlightHelper(index < 0 ? this.menuItems.length : index, -1);
    }
    /** Highlights the first highlightable item. */
    highlightFirst() {
        this.highlightHelper(-1, 1);
    }
    /** Highlights the last highlightable item. */
    highlightLast() {
        this.highlightHelper(this.menuItems.length, -1);
    }
    /**
     * Helper function that manages the details of moving the highlight among
     * child menuitems in response to keyboard events.
     *
     * @param startIndex Start index.
     * @param delta Step direction: 1 to go down, -1 to go up.
     */
    highlightHelper(startIndex, delta) {
        let index = startIndex + delta;
        let menuItem;
        while (menuItem = this.menuItems[index]) {
            if (menuItem.isEnabled()) {
                this.setHighlighted(menuItem);
                break;
            }
            index += delta;
        }
    }
    // Mouse events.
    /**
     * Handles mouseover events. Highlight menuitems as the user hovers over them.
     *
     * @param e Mouse event to handle.
     */
    handleMouseOver(e) {
        const menuItem = this.getMenuItem(e.target);
        if (menuItem) {
            if (menuItem.isEnabled()) {
                if (this.highlightedItem !== menuItem) {
                    this.setHighlighted(menuItem);
                }
            }
            else {
                this.setHighlighted(null);
            }
        }
    }
    /**
     * Handles click events. Pass the event onto the child menuitem to handle.
     *
     * @param e Click event to handle.
     */
    handleClick(e) {
        const oldCoords = this.openingCoords;
        // Clear out the saved opening coords immediately so they're not used twice.
        this.openingCoords = null;
        if (oldCoords && typeof e.clientX === 'number') {
            const newCoords = new Coordinate(e.clientX, e.clientY);
            if (Coordinate.distance(oldCoords, newCoords) < 1) {
                // This menu was opened by a mousedown and we're handling the consequent
                // click event. The coords haven't changed, meaning this was the same
                // opening event. Don't do the usual behavior because the menu just
                // popped up under the mouse and the user didn't mean to activate this
                // item.
                return;
            }
        }
        const menuItem = this.getMenuItem(e.target);
        if (menuItem) {
            menuItem.performAction();
        }
    }
    /**
     * Handles mouse enter events. Focus the element.
     *
     * @param _e Mouse event to handle.
     */
    handleMouseEnter(_e) {
        this.focus();
    }
    /**
     * Handles mouse leave events. Blur and clear highlight.
     *
     * @param _e Mouse event to handle.
     */
    handleMouseLeave(_e) {
        if (this.getElement()) {
            this.blur();
            this.setHighlighted(null);
        }
    }
    // Keyboard events.
    /**
     * Attempts to handle a keyboard event, if the menu item is enabled, by
     * calling
     * {@link Menu#handleKeyEventInternal_}.
     *
     * @param e Key event to handle.
     */
    handleKeyEvent(e) {
        if (!this.menuItems.length) {
            // Empty menu.
            return;
        }
        const keyboardEvent = e;
        if (keyboardEvent.shiftKey || keyboardEvent.ctrlKey ||
            keyboardEvent.metaKey || keyboardEvent.altKey) {
            // Do not handle the key event if any modifier key is pressed.
            return;
        }
        const highlighted = this.highlightedItem;
        switch (keyboardEvent.key) {
            case 'Enter':
            case ' ':
                if (highlighted) {
                    highlighted.performAction();
                }
                break;
            case 'ArrowUp':
                this.highlightPrevious();
                break;
            case 'ArrowDown':
                this.highlightNext();
                break;
            case 'PageUp':
            case 'Home':
                this.highlightFirst();
                break;
            case 'PageDown':
            case 'End':
                this.highlightLast();
                break;
            default:
                // Not a key the menu is interested in.
                return;
        }
        // The menu used this key, don't let it have secondary effects.
        e.preventDefault();
        e.stopPropagation();
    }
    /**
     * Get the size of a rendered menu.
     *
     * @returns Object with width and height properties.
     * @internal
     */
    getSize() {
        const menuDom = this.getElement();
        const menuSize = style.getSize(menuDom);
        // Recalculate height for the total content, not only box height.
        menuSize.height = menuDom.scrollHeight;
        return menuSize;
    }
}
//# sourceMappingURL=menu.js.map