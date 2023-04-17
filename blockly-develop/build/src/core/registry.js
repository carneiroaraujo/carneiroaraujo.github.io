/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.registry');
/**
 * A map of maps. With the keys being the type and name of the class we are
 * registering and the value being the constructor function.
 * e.g. {'field': {'field_angle': Blockly.FieldAngle}}
 */
const typeMap = Object.create(null);
export const TEST_ONLY = { typeMap };
/**
 * A map of maps. With the keys being the type and caseless name of the class we
 * are registring, and the value being the most recent cased name for that
 * registration.
 */
const nameMap = Object.create(null);
/**
 * The string used to register the default class for a type of plugin.
 */
export const DEFAULT = 'default';
/**
 * A name with the type of the element stored in the generic.
 */
class Type {
    /** @param name The name of the registry type. */
    constructor(name) {
        this.name = name;
    }
    /**
     * Returns the name of the type.
     *
     * @returns The name.
     */
    toString() {
        return this.name;
    }
}
Type.CONNECTION_CHECKER = new Type('connectionChecker');
Type.CURSOR = new Type('cursor');
Type.EVENT = new Type('event');
Type.FIELD = new Type('field');
Type.RENDERER = new Type('renderer');
Type.TOOLBOX = new Type('toolbox');
Type.THEME = new Type('theme');
Type.TOOLBOX_ITEM = new Type('toolboxItem');
Type.FLYOUTS_VERTICAL_TOOLBOX = new Type('flyoutsVerticalToolbox');
Type.FLYOUTS_HORIZONTAL_TOOLBOX = new Type('flyoutsHorizontalToolbox');
Type.METRICS_MANAGER = new Type('metricsManager');
Type.BLOCK_DRAGGER = new Type('blockDragger');
/** @internal */
Type.SERIALIZER = new Type('serializer');
export { Type };
/**
 * Registers a class based on a type and name.
 *
 * @param type The type of the plugin.
 *     (e.g. Field, Renderer)
 * @param name The plugin's name. (Ex. field_angle, geras)
 * @param registryItem The class or object to register.
 * @param opt_allowOverrides True to prevent an error when overriding an already
 *     registered item.
 * @throws {Error} if the type or name is empty, a name with the given type has
 *     already been registered, or if the given class or object is not valid for
 *     its type.
 */
export function register(type, name, registryItem, opt_allowOverrides) {
    if (!(type instanceof Type) && typeof type !== 'string' ||
        `${type}`.trim() === '') {
        throw Error('Invalid type "' + type + '". The type must be a' +
            ' non-empty string or a Blockly.registry.Type.');
    }
    type = `${type}`.toLowerCase();
    if (typeof name !== 'string' || name.trim() === '') {
        throw Error('Invalid name "' + name + '". The name must be a' +
            ' non-empty string.');
    }
    const caselessName = name.toLowerCase();
    if (!registryItem) {
        throw Error('Can not register a null value');
    }
    let typeRegistry = typeMap[type];
    let nameRegistry = nameMap[type];
    // If the type registry has not been created, create it.
    if (!typeRegistry) {
        typeRegistry = typeMap[type] = Object.create(null);
        nameRegistry = nameMap[type] = Object.create(null);
    }
    // Validate that the given class has all the required properties.
    validate(type, registryItem);
    // Don't throw an error if opt_allowOverrides is true.
    if (!opt_allowOverrides && typeRegistry[caselessName]) {
        throw Error('Name "' + caselessName + '" with type "' + type +
            '" already registered.');
    }
    typeRegistry[caselessName] = registryItem;
    nameRegistry[caselessName] = name;
}
/**
 * Checks the given registry item for properties that are required based on the
 * type.
 *
 * @param type The type of the plugin. (e.g. Field, Renderer)
 * @param registryItem A class or object that we are checking for the required
 *     properties.
 */
function validate(type, registryItem) {
    switch (type) {
        case String(Type.FIELD):
            if (typeof registryItem.fromJson !== 'function') {
                throw Error('Type "' + type + '" must have a fromJson function');
            }
            break;
    }
}
/**
 * Unregisters the registry item with the given type and name.
 *
 * @param type The type of the plugin.
 *     (e.g. Field, Renderer)
 * @param name The plugin's name. (Ex. field_angle, geras)
 */
export function unregister(type, name) {
    type = `${type}`.toLowerCase();
    name = name.toLowerCase();
    const typeRegistry = typeMap[type];
    if (!typeRegistry || !typeRegistry[name]) {
        console.warn('Unable to unregister [' + name + '][' + type + '] from the ' +
            'registry.');
        return;
    }
    delete typeMap[type][name];
    delete nameMap[type][name];
}
/**
 * Gets the registry item for the given name and type. This can be either a
 * class or an object.
 *
 * @param type The type of the plugin.
 *     (e.g. Field, Renderer)
 * @param name The plugin's name. (Ex. field_angle, geras)
 * @param opt_throwIfMissing Whether or not to throw an error if we are unable
 *     to find the plugin.
 * @returns The class or object with the given name and type or null if none
 *     exists.
 */
function getItem(type, name, opt_throwIfMissing) {
    type = `${type}`.toLowerCase();
    name = name.toLowerCase();
    const typeRegistry = typeMap[type];
    if (!typeRegistry || !typeRegistry[name]) {
        const msg = 'Unable to find [' + name + '][' + type + '] in the registry.';
        if (opt_throwIfMissing) {
            throw new Error(msg + ' You must require or register a ' + type + ' plugin.');
        }
        else {
            console.warn(msg);
        }
        return null;
    }
    return typeRegistry[name];
}
/**
 * Returns whether or not the registry contains an item with the given type and
 * name.
 *
 * @param type The type of the plugin.
 *     (e.g. Field, Renderer)
 * @param name The plugin's name. (Ex. field_angle, geras)
 * @returns True if the registry has an item with the given type and name, false
 *     otherwise.
 */
export function hasItem(type, name) {
    type = `${type}`.toLowerCase();
    name = name.toLowerCase();
    const typeRegistry = typeMap[type];
    if (!typeRegistry) {
        return false;
    }
    return !!typeRegistry[name];
}
/**
 * Gets the class for the given name and type.
 *
 * @param type The type of the plugin.
 *     (e.g. Field, Renderer)
 * @param name The plugin's name. (Ex. field_angle, geras)
 * @param opt_throwIfMissing Whether or not to throw an error if we are unable
 *     to find the plugin.
 * @returns The class with the given name and type or null if none exists.
 */
export function getClass(type, name, opt_throwIfMissing) {
    return getItem(type, name, opt_throwIfMissing);
}
/**
 * Gets the object for the given name and type.
 *
 * @param type The type of the plugin.
 *     (e.g. Category)
 * @param name The plugin's name. (Ex. logic_category)
 * @param opt_throwIfMissing Whether or not to throw an error if we are unable
 *     to find the object.
 * @returns The object with the given name and type or null if none exists.
 */
export function getObject(type, name, opt_throwIfMissing) {
    return getItem(type, name, opt_throwIfMissing);
}
/**
 * Returns a map of items registered with the given type.
 *
 * @param type The type of the plugin. (e.g. Category)
 * @param opt_cased Whether or not to return a map with cased keys (rather than
 *     caseless keys). False by default.
 * @param opt_throwIfMissing Whether or not to throw an error if we are unable
 *     to find the object. False by default.
 * @returns A map of objects with the given type, or null if none exists.
 */
export function getAllItems(type, opt_cased, opt_throwIfMissing) {
    type = `${type}`.toLowerCase();
    const typeRegistry = typeMap[type];
    if (!typeRegistry) {
        const msg = `Unable to find [${type}] in the registry.`;
        if (opt_throwIfMissing) {
            throw new Error(`${msg} You must require or register a ${type} plugin.`);
        }
        else {
            console.warn(msg);
        }
        return null;
    }
    if (!opt_cased) {
        return typeRegistry;
    }
    const nameRegistry = nameMap[type];
    const casedRegistry = Object.create(null);
    for (const key of Object.keys(typeRegistry)) {
        casedRegistry[nameRegistry[key]] = typeRegistry[key];
    }
    return casedRegistry;
}
/**
 * Gets the class from Blockly options for the given type.
 * This is used for plugins that override a built in feature. (e.g. Toolbox)
 *
 * @param type The type of the plugin.
 * @param options The option object to check for the given plugin.
 * @param opt_throwIfMissing Whether or not to throw an error if we are unable
 *     to find the plugin.
 * @returns The class for the plugin.
 */
export function getClassFromOptions(type, options, opt_throwIfMissing) {
    const plugin = options.plugins[String(type)] || DEFAULT;
    // If the user passed in a plugin class instead of a registered plugin name.
    if (typeof plugin === 'function') {
        return plugin;
    }
    return getClass(type, plugin, opt_throwIfMissing);
}
//# sourceMappingURL=registry.js.map