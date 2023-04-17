/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Registry for context menu option items.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.ContextMenuRegistry');
/**
 * Class for the registry of context menu items. This is intended to be a
 * singleton. You should not create a new instance, and only access this class
 * from ContextMenuRegistry.registry.
 */
export class ContextMenuRegistry {
    /** Resets the existing singleton instance of ContextMenuRegistry. */
    constructor() {
        /** Registry of all registered RegistryItems, keyed by ID. */
        this.registry_ = new Map();
        this.reset();
    }
    /** Clear and recreate the registry. */
    reset() {
        this.registry_.clear();
    }
    /**
     * Registers a RegistryItem.
     *
     * @param item Context menu item to register.
     * @throws {Error} if an item with the given ID already exists.
     */
    register(item) {
        if (this.registry_.has(item.id)) {
            throw Error('Menu item with ID "' + item.id + '" is already registered.');
        }
        this.registry_.set(item.id, item);
    }
    /**
     * Unregisters a RegistryItem with the given ID.
     *
     * @param id The ID of the RegistryItem to remove.
     * @throws {Error} if an item with the given ID does not exist.
     */
    unregister(id) {
        if (!this.registry_.has(id)) {
            throw new Error('Menu item with ID "' + id + '" not found.');
        }
        this.registry_.delete(id);
    }
    /**
     * @param id The ID of the RegistryItem to get.
     * @returns RegistryItem or null if not found
     */
    getItem(id) {
        return this.registry_.get(id) ?? null;
    }
    /**
     * Gets the valid context menu options for the given scope type (e.g. block or
     * workspace) and scope. Blocks are only shown if the preconditionFn shows
     * they should not be hidden.
     *
     * @param scopeType Type of scope where menu should be shown (e.g. on a block
     *     or on a workspace)
     * @param scope Current scope of context menu (i.e., the exact workspace or
     *     block being clicked on)
     * @returns the list of ContextMenuOptions
     */
    getContextMenuOptions(scopeType, scope) {
        const menuOptions = [];
        for (const item of this.registry_.values()) {
            if (scopeType === item.scopeType) {
                const precondition = item.preconditionFn(scope);
                if (precondition !== 'hidden') {
                    const displayText = typeof item.displayText === 'function' ?
                        item.displayText(scope) :
                        item.displayText;
                    const menuOption = {
                        text: displayText,
                        enabled: precondition === 'enabled',
                        callback: item.callback,
                        scope,
                        weight: item.weight,
                    };
                    menuOptions.push(menuOption);
                }
            }
        }
        menuOptions.sort(function (a, b) {
            return a.weight - b.weight;
        });
        return menuOptions;
    }
}
(function (ContextMenuRegistry) {
    /**
     * Where this menu item should be rendered. If the menu item should be
     * rendered in multiple scopes, e.g. on both a block and a workspace, it
     * should be registered for each scope.
     */
    let ScopeType;
    (function (ScopeType) {
        ScopeType["BLOCK"] = "block";
        ScopeType["WORKSPACE"] = "workspace";
    })(ScopeType = ContextMenuRegistry.ScopeType || (ContextMenuRegistry.ScopeType = {}));
    /**
     * Singleton instance of this class. All interactions with this class should
     * be done on this object.
     */
    ContextMenuRegistry.registry = new ContextMenuRegistry();
})(ContextMenuRegistry || (ContextMenuRegistry = {}));
export const ScopeType = ContextMenuRegistry.ScopeType;
//# sourceMappingURL=contextmenu_registry.js.map