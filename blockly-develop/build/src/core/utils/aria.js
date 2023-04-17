/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.utils.aria');
/** ARIA states/properties prefix. */
const ARIA_PREFIX = 'aria-';
/** ARIA role attribute. */
const ROLE_ATTRIBUTE = 'role';
/**
 * ARIA role values.
 * Copied from Closure's goog.a11y.aria.Role
 */
export var Role;
(function (Role) {
    // ARIA role for an interactive control of tabular data.
    Role["GRID"] = "grid";
    // ARIA role for a cell in a grid.
    Role["GRIDCELL"] = "gridcell";
    // ARIA role for a group of related elements like tree item siblings.
    Role["GROUP"] = "group";
    // ARIA role for a listbox.
    Role["LISTBOX"] = "listbox";
    // ARIA role for a popup menu.
    Role["MENU"] = "menu";
    // ARIA role for menu item elements.
    Role["MENUITEM"] = "menuitem";
    // ARIA role for a checkbox box element inside a menu.
    Role["MENUITEMCHECKBOX"] = "menuitemcheckbox";
    // ARIA role for option items that are  children of combobox, listbox, menu,
    // radiogroup, or tree elements.
    Role["OPTION"] = "option";
    // ARIA role for ignorable cosmetic elements with no semantic significance.
    Role["PRESENTATION"] = "presentation";
    // ARIA role for a row of cells in a grid.
    Role["ROW"] = "row";
    // ARIA role for a tree.
    Role["TREE"] = "tree";
    // ARIA role for a tree item that sometimes may be expanded or collapsed.
    Role["TREEITEM"] = "treeitem";
})(Role || (Role = {}));
/**
 * ARIA states and properties.
 * Copied from Closure's goog.a11y.aria.State
 */
export var State;
(function (State) {
    // ARIA property for setting the currently active descendant of an element,
    // for example the selected item in a list box. Value: ID of an element.
    State["ACTIVEDESCENDANT"] = "activedescendant";
    // ARIA property defines the total number of columns in a table, grid, or
    // treegrid.
    // Value: integer.
    State["COLCOUNT"] = "colcount";
    // ARIA state for a disabled item. Value: one of {true, false}.
    State["DISABLED"] = "disabled";
    // ARIA state for setting whether the element like a tree node is expanded.
    // Value: one of {true, false, undefined}.
    State["EXPANDED"] = "expanded";
    // ARIA state indicating that the entered value does not conform. Value:
    // one of {false, true, 'grammar', 'spelling'}
    State["INVALID"] = "invalid";
    // ARIA property that provides a label to override any other text, value, or
    // contents used to describe this element. Value: string.
    State["LABEL"] = "label";
    // ARIA property for setting the element which labels another element.
    // Value: space-separated IDs of elements.
    State["LABELLEDBY"] = "labelledby";
    // ARIA property for setting the level of an element in the hierarchy.
    // Value: integer.
    State["LEVEL"] = "level";
    // ARIA property indicating if the element is horizontal or vertical.
    // Value: one of {'vertical', 'horizontal'}.
    State["ORIENTATION"] = "orientation";
    // ARIA property that defines an element's number of position in a list.
    // Value: integer.
    State["POSINSET"] = "posinset";
    // ARIA property defines the total number of rows in a table, grid, or
    // treegrid.
    // Value: integer.
    State["ROWCOUNT"] = "rowcount";
    // ARIA state for setting the currently selected item in the list.
    // Value: one of {true, false, undefined}.
    State["SELECTED"] = "selected";
    // ARIA property defining the number of items in a list. Value: integer.
    State["SETSIZE"] = "setsize";
    // ARIA property for slider maximum value. Value: number.
    State["VALUEMAX"] = "valuemax";
    // ARIA property for slider minimum value. Value: number.
    State["VALUEMIN"] = "valuemin";
})(State || (State = {}));
/**
 * Sets the role of an element.
 *
 * Similar to Closure's goog.a11y.aria
 *
 * @param element DOM node to set role of.
 * @param roleName Role name.
 */
export function setRole(element, roleName) {
    element.setAttribute(ROLE_ATTRIBUTE, roleName);
}
/**
 * Sets the state or property of an element.
 * Copied from Closure's goog.a11y.aria
 *
 * @param element DOM node where we set state.
 * @param stateName State attribute being set.
 *     Automatically adds prefix 'aria-' to the state name if the attribute is
 * not an extra attribute.
 * @param value Value for the state attribute.
 */
export function setState(element, stateName, value) {
    if (Array.isArray(value)) {
        value = value.join(' ');
    }
    const attrStateName = ARIA_PREFIX + stateName;
    element.setAttribute(attrStateName, `${value}`);
}
//# sourceMappingURL=aria.js.map