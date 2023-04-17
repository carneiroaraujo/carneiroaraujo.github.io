/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.utils.toolbox');
import * as utilsXml from './xml.js';
/**
 * The name used to identify a toolbox that has category like items.
 * This only needs to be used if a toolbox wants to be treated like a category
 * toolbox but does not actually contain any toolbox items with the kind
 * 'category'.
 */
const CATEGORY_TOOLBOX_KIND = 'categoryToolbox';
/**
 * The name used to identify a toolbox that has no categories and is displayed
 * as a simple flyout displaying blocks, buttons, or labels.
 */
const FLYOUT_TOOLBOX_KIND = 'flyoutToolbox';
/**
 * Position of the toolbox and/or flyout relative to the workspace.
 */
export var Position;
(function (Position) {
    Position[Position["TOP"] = 0] = "TOP";
    Position[Position["BOTTOM"] = 1] = "BOTTOM";
    Position[Position["LEFT"] = 2] = "LEFT";
    Position[Position["RIGHT"] = 3] = "RIGHT";
})(Position || (Position = {}));
/**
 * Converts the toolbox definition into toolbox JSON.
 *
 * @param toolboxDef The definition of the toolbox in one of its many forms.
 * @returns Object holding information for creating a toolbox.
 * @internal
 */
export function convertToolboxDefToJson(toolboxDef) {
    if (!toolboxDef) {
        return null;
    }
    if (toolboxDef instanceof Element || typeof toolboxDef === 'string') {
        toolboxDef = parseToolboxTree(toolboxDef);
        // AnyDuringMigration because:  Argument of type 'Node | null' is not
        // assignable to parameter of type 'Node'.
        toolboxDef = convertToToolboxJson(toolboxDef);
    }
    const toolboxJson = toolboxDef;
    validateToolbox(toolboxJson);
    return toolboxJson;
}
/**
 * Validates the toolbox JSON fields have been set correctly.
 *
 * @param toolboxJson Object holding information for creating a toolbox.
 * @throws {Error} if the toolbox is not the correct format.
 */
function validateToolbox(toolboxJson) {
    const toolboxKind = toolboxJson['kind'];
    const toolboxContents = toolboxJson['contents'];
    if (toolboxKind) {
        if (toolboxKind !== FLYOUT_TOOLBOX_KIND &&
            toolboxKind !== CATEGORY_TOOLBOX_KIND) {
            throw Error('Invalid toolbox kind ' + toolboxKind + '.' +
                ' Please supply either ' + FLYOUT_TOOLBOX_KIND + ' or ' +
                CATEGORY_TOOLBOX_KIND);
        }
    }
    if (!toolboxContents) {
        throw Error('Toolbox must have a contents attribute.');
    }
}
/**
 * Converts the flyout definition into a list of flyout items.
 *
 * @param flyoutDef The definition of the flyout in one of its many forms.
 * @returns A list of flyout items.
 * @internal
 */
export function convertFlyoutDefToJsonArray(flyoutDef) {
    if (!flyoutDef) {
        return [];
    }
    if (flyoutDef['contents']) {
        return flyoutDef['contents'];
    }
    // If it is already in the correct format return the flyoutDef.
    // AnyDuringMigration because:  Property 'nodeType' does not exist on type
    // 'Node | FlyoutItemInfo'.
    if (Array.isArray(flyoutDef) && flyoutDef.length > 0 &&
        !(flyoutDef[0]).nodeType) {
        // AnyDuringMigration because:  Type 'FlyoutItemInfoArray | Node[]' is not
        // assignable to type 'FlyoutItemInfoArray'.
        return flyoutDef;
    }
    // AnyDuringMigration because:  Type 'ToolboxItemInfo[] | FlyoutItemInfoArray'
    // is not assignable to type 'FlyoutItemInfoArray'.
    return xmlToJsonArray(flyoutDef);
}
/**
 * Whether or not the toolbox definition has categories.
 *
 * @param toolboxJson Object holding information for creating a toolbox.
 * @returns True if the toolbox has categories.
 * @internal
 */
export function hasCategories(toolboxJson) {
    return TEST_ONLY.hasCategoriesInternal(toolboxJson);
}
/**
 * Private version of hasCategories for stubbing in tests.
 */
function hasCategoriesInternal(toolboxJson) {
    if (!toolboxJson) {
        return false;
    }
    const toolboxKind = toolboxJson['kind'];
    if (toolboxKind) {
        return toolboxKind === CATEGORY_TOOLBOX_KIND;
    }
    const categories = toolboxJson['contents'].filter(function (item) {
        return item['kind'].toUpperCase() === 'CATEGORY';
    });
    return !!categories.length;
}
/**
 * Whether or not the category is collapsible.
 *
 * @param categoryInfo Object holing information for creating a category.
 * @returns True if the category has subcategories.
 * @internal
 */
export function isCategoryCollapsible(categoryInfo) {
    if (!categoryInfo || !categoryInfo['contents']) {
        return false;
    }
    const categories = categoryInfo['contents'].filter(function (item) {
        return item['kind'].toUpperCase() === 'CATEGORY';
    });
    return !!categories.length;
}
/**
 * Parses the provided toolbox definition into a consistent format.
 *
 * @param toolboxDef The definition of the toolbox in one of its many forms.
 * @returns Object holding information for creating a toolbox.
 */
function convertToToolboxJson(toolboxDef) {
    const contents = xmlToJsonArray(toolboxDef);
    const toolboxJson = { 'contents': contents };
    if (toolboxDef instanceof Node) {
        addAttributes(toolboxDef, toolboxJson);
    }
    return toolboxJson;
}
/**
 * Converts the xml for a toolbox to JSON.
 *
 * @param toolboxDef The definition of the toolbox in one of its many forms.
 * @returns A list of objects in the toolbox.
 */
function xmlToJsonArray(toolboxDef) {
    const arr = [];
    // If it is a node it will have children.
    // AnyDuringMigration because:  Property 'childNodes' does not exist on type
    // 'Node | NodeList | Node[]'.
    let childNodes = toolboxDef.childNodes;
    if (!childNodes) {
        // Otherwise the toolboxDef is an array or collection.
        childNodes = toolboxDef;
    }
    for (let i = 0, child; child = childNodes[i]; i++) {
        if (!child.tagName) {
            continue;
        }
        const obj = {};
        const tagName = child.tagName.toUpperCase();
        obj['kind'] = tagName;
        // Store the XML for a block.
        if (tagName === 'BLOCK') {
            obj['blockxml'] = child;
        }
        else if (child.childNodes && child.childNodes.length > 0) {
            // Get the contents of a category
            obj['contents'] = xmlToJsonArray(child);
        }
        // Add XML attributes to object
        addAttributes(child, obj);
        arr.push(obj);
    }
    // AnyDuringMigration because:  Type '{}[]' is not assignable to type
    // 'ToolboxItemInfo[] | FlyoutItemInfoArray'.
    return arr;
}
/**
 * Adds the attributes on the node to the given object.
 *
 * @param node The node to copy the attributes from.
 * @param obj The object to copy the attributes to.
 */
function addAttributes(node, obj) {
    // AnyDuringMigration because:  Property 'attributes' does not exist on type
    // 'Node'.
    for (let j = 0; j < node.attributes.length; j++) {
        // AnyDuringMigration because:  Property 'attributes' does not exist on type
        // 'Node'.
        const attr = node.attributes[j];
        if (attr.nodeName.indexOf('css-') > -1) {
            obj['cssconfig'] = obj['cssconfig'] || {};
            obj['cssconfig'][attr.nodeName.replace('css-', '')] = attr.value;
        }
        else {
            obj[attr.nodeName] = attr.value;
        }
    }
}
/**
 * Parse the provided toolbox tree into a consistent DOM format.
 *
 * @param toolboxDef DOM tree of blocks, or text representation of same.
 * @returns DOM tree of blocks, or null.
 */
export function parseToolboxTree(toolboxDef) {
    let parsedToolboxDef = null;
    if (toolboxDef) {
        if (typeof toolboxDef === 'string') {
            parsedToolboxDef = utilsXml.textToDom(toolboxDef);
            if (parsedToolboxDef.nodeName.toLowerCase() !== 'xml') {
                throw TypeError('Toolbox should be an <xml> document.');
            }
        }
        else if (toolboxDef instanceof Element) {
            parsedToolboxDef = toolboxDef;
        }
    }
    return parsedToolboxDef;
}
export const TEST_ONLY = {
    hasCategoriesInternal,
};
//# sourceMappingURL=toolbox.js.map