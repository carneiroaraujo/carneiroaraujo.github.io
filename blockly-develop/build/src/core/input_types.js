/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.inputTypes');
/**
 * Enum for the type of a connection or input.
 */
export var inputTypes;
(function (inputTypes) {
    // A right-facing value input.  E.g. 'set item to' or 'return'.
    inputTypes[inputTypes["VALUE"] = 1] = "VALUE";
    // A down-facing block stack.  E.g. 'if-do' or 'else'.
    inputTypes[inputTypes["STATEMENT"] = 3] = "STATEMENT";
    // A dummy input.  Used to add field(s) with no input.
    inputTypes[inputTypes["DUMMY"] = 5] = "DUMMY";
})(inputTypes || (inputTypes = {}));
//# sourceMappingURL=input_types.js.map