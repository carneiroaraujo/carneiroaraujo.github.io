/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Manager for all items registered with the workspace.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.ComponentManager');
import * as arrayUtils from './utils/array.js';
class Capability {
    /** @param name The name of the component capability. */
    constructor(name) {
        this.name_ = name;
    }
    /**
     * Returns the name of the capability.
     *
     * @returns The name.
     */
    toString() {
        return this.name_;
    }
}
Capability.POSITIONABLE = new Capability('positionable');
Capability.DRAG_TARGET = new Capability('drag_target');
Capability.DELETE_AREA = new Capability('delete_area');
Capability.AUTOHIDEABLE = new Capability('autohideable');
/**
 * Manager for all items registered with the workspace.
 */
class ComponentManager {
    constructor() {
        /**
         * A map of the components registered with the workspace, mapped to id.
         */
        this.componentData = new Map();
        /** A map of capabilities to component IDs. */
        this.capabilityToComponentIds = new Map();
    }
    /**
     * Adds a component.
     *
     * @param componentInfo The data for the component to register.
     * @param opt_allowOverrides True to prevent an error when overriding an
     *     already registered item.
     */
    addComponent(componentInfo, opt_allowOverrides) {
        // Don't throw an error if opt_allowOverrides is true.
        const id = componentInfo.component.id;
        if (!opt_allowOverrides && this.componentData.has(id)) {
            throw Error('Plugin "' + id + '" with capabilities "' +
                this.componentData.get(id)?.capabilities + '" already added.');
        }
        this.componentData.set(id, componentInfo);
        const stringCapabilities = [];
        for (let i = 0; i < componentInfo.capabilities.length; i++) {
            const capability = String(componentInfo.capabilities[i]).toLowerCase();
            stringCapabilities.push(capability);
            if (!this.capabilityToComponentIds.has(capability)) {
                this.capabilityToComponentIds.set(capability, [id]);
            }
            else {
                this.capabilityToComponentIds.get(capability)?.push(id);
            }
        }
        this.componentData.get(id).capabilities = stringCapabilities;
    }
    /**
     * Removes a component.
     *
     * @param id The ID of the component to remove.
     */
    removeComponent(id) {
        const componentInfo = this.componentData.get(id);
        if (!componentInfo) {
            return;
        }
        for (let i = 0; i < componentInfo.capabilities.length; i++) {
            const capability = String(componentInfo.capabilities[i]).toLowerCase();
            arrayUtils.removeElem(this.capabilityToComponentIds.get(capability), id);
        }
        this.componentData.delete(id);
    }
    /**
     * Adds a capability to a existing registered component.
     *
     * @param id The ID of the component to add the capability to.
     * @param capability The capability to add.
     */
    addCapability(id, capability) {
        if (!this.getComponent(id)) {
            throw Error('Cannot add capability, "' + capability + '". Plugin "' + id +
                '" has not been added to the ComponentManager');
        }
        if (this.hasCapability(id, capability)) {
            console.warn('Plugin "' + id + 'already has capability "' + capability + '"');
            return;
        }
        capability = `${capability}`.toLowerCase();
        this.componentData.get(id)?.capabilities.push(capability);
        this.capabilityToComponentIds.get(capability)?.push(id);
    }
    /**
     * Removes a capability from an existing registered component.
     *
     * @param id The ID of the component to remove the capability from.
     * @param capability The capability to remove.
     */
    removeCapability(id, capability) {
        if (!this.getComponent(id)) {
            throw Error('Cannot remove capability, "' + capability + '". Plugin "' + id +
                '" has not been added to the ComponentManager');
        }
        if (!this.hasCapability(id, capability)) {
            console.warn('Plugin "' + id + 'doesn\'t have capability "' + capability +
                '" to remove');
            return;
        }
        capability = `${capability}`.toLowerCase();
        arrayUtils.removeElem(this.componentData.get(id).capabilities, capability);
        arrayUtils.removeElem(this.capabilityToComponentIds.get(capability), id);
    }
    /**
     * Returns whether the component with this id has the specified capability.
     *
     * @param id The ID of the component to check.
     * @param capability The capability to check for.
     * @returns Whether the component has the capability.
     */
    hasCapability(id, capability) {
        capability = `${capability}`.toLowerCase();
        return this.componentData.has(id) &&
            this.componentData.get(id).capabilities.indexOf(capability) !== -1;
    }
    /**
     * Gets the component with the given ID.
     *
     * @param id The ID of the component to get.
     * @returns The component with the given name or undefined if not found.
     */
    getComponent(id) {
        return this.componentData.get(id)?.component;
    }
    /**
     * Gets all the components with the specified capability.
     *
     * @param capability The capability of the component.
     * @param sorted Whether to return list ordered by weights.
     * @returns The components that match the specified capability.
     */
    getComponents(capability, sorted) {
        capability = `${capability}`.toLowerCase();
        const componentIds = this.capabilityToComponentIds.get(capability);
        if (!componentIds) {
            return [];
        }
        const components = [];
        if (sorted) {
            const componentDataList = [];
            componentIds.forEach((id) => {
                componentDataList.push(this.componentData.get(id));
            });
            componentDataList.sort(function (a, b) {
                return a.weight - b.weight;
            });
            componentDataList.forEach(function (componentDatum) {
                components.push(componentDatum.component);
            });
        }
        else {
            componentIds.forEach((id) => {
                components.push(this.componentData.get(id).component);
            });
        }
        return components;
    }
}
ComponentManager.Capability = Capability;
export { ComponentManager };
//# sourceMappingURL=component_manager.js.map