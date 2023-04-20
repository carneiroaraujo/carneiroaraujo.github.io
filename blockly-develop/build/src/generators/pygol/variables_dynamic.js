/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Generating Pygol for dynamic variable blocks.
 */
'use strict';
goog.module('Blockly.Pygol.variablesDynamic');
const { pygolGenerator: Pygol } = goog.require('Blockly.Pygol');
/** @suppress {extraRequire} */
goog.require('Blockly.Pygol.variables');
// Python is dynamically typed.
Pygol['variables_get_dynamic'] = Pygol['variables_get'];
Pygol['variables_set_dynamic'] = Pygol['variables_set'];
//# sourceMappingURL=variables_dynamic.js.map