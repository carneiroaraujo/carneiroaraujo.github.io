/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.serialization.registry');
import * as registry from '../registry.js';
/**
 * Registers the given serializer so that it can be used for serialization and
 * deserialization.
 *
 * @param name The name of the serializer to register.
 * @param serializer The serializer to register.
 */
export function register(name, serializer) {
    registry.register(registry.Type.SERIALIZER, name, serializer);
}
/**
 * Unregisters the serializer associated with the given name.
 *
 * @param name The name of the serializer to unregister.
 */
export function unregister(name) {
    registry.unregister(registry.Type.SERIALIZER, name);
}
//# sourceMappingURL=registry.js.map