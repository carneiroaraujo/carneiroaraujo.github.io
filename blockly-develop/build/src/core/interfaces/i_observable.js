/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Type guard for checking if an object fulfills IObservable.
 *
 * @internal
 */
export function isObservable(obj) {
    return obj.startPublishing !== undefined && obj.stopPublishing !== undefined;
}
//# sourceMappingURL=i_observable.js.map