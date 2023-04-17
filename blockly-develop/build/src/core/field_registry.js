/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.fieldRegistry');
import * as registry from './registry.js';
/**
 * Registers a field type.
 * fieldRegistry.fromJson uses this registry to
 * find the appropriate field type.
 *
 * @param type The field type name as used in the JSON definition.
 * @param fieldClass The field class containing a fromJson function that can
 *     construct an instance of the field.
 * @throws {Error} if the type name is empty, the field is already registered,
 *     or the fieldClass is not an object containing a fromJson function.
 */
export function register(type, fieldClass) {
    registry.register(registry.Type.FIELD, type, fieldClass);
}
/**
 * Unregisters the field registered with the given type.
 *
 * @param type The field type name as used in the JSON definition.
 */
export function unregister(type) {
    registry.unregister(registry.Type.FIELD, type);
}
/**
 * Construct a Field from a JSON arg object.
 * Finds the appropriate registered field by the type name as registered using
 * fieldRegistry.register.
 *
 * @param options A JSON object with a type and options specific to the field
 *     type.
 * @returns The new field instance or null if a field wasn't found with the
 *     given type name
 * @internal
 */
export function fromJson(options) {
    return TEST_ONLY.fromJsonInternal(options);
}
/**
 * Private version of fromJson for stubbing in tests.
 *
 * @param options
 */
function fromJsonInternal(options) {
    const fieldObject = registry.getObject(registry.Type.FIELD, options.type);
    if (!fieldObject) {
        console.warn('Blockly could not create a field of type ' + options['type'] +
            '. The field is probably not being registered. This could be because' +
            ' the file is not loaded, the field does not register itself (Issue' +
            ' #1584), or the registration is not being reached.');
        return null;
    }
    else if (typeof fieldObject.fromJson !== 'function') {
        throw new TypeError('returned Field was not a IRegistrableField');
    }
    else {
        return fieldObject.fromJson(options);
    }
}
export const TEST_ONLY = {
    fromJsonInternal,
};
//# sourceMappingURL=field_registry.js.map