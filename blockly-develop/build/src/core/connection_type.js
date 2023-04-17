/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.ConnectionType');
/**
 * Enum for the type of a connection or input.
 */
export var ConnectionType;
(function (ConnectionType) {
    // A right-facing value input.  E.g. 'set item to' or 'return'.
    ConnectionType[ConnectionType["INPUT_VALUE"] = 1] = "INPUT_VALUE";
    // A left-facing value output.  E.g. 'random fraction'.
    ConnectionType[ConnectionType["OUTPUT_VALUE"] = 2] = "OUTPUT_VALUE";
    // A down-facing block stack.  E.g. 'if-do' or 'else'.
    ConnectionType[ConnectionType["NEXT_STATEMENT"] = 3] = "NEXT_STATEMENT";
    // An up-facing block stack.  E.g. 'break out of loop'.
    ConnectionType[ConnectionType["PREVIOUS_STATEMENT"] = 4] = "PREVIOUS_STATEMENT";
})(ConnectionType || (ConnectionType = {}));
//# sourceMappingURL=connection_type.js.map