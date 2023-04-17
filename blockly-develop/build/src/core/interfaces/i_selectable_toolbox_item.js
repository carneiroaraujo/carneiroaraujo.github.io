/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.ISelectableToolboxItem');
/**
 * Type guard that checks whether an IToolboxItem is an ISelectableToolboxItem.
 */
export function isSelectableToolboxItem(toolboxItem) {
    return toolboxItem.isSelectable();
}
//# sourceMappingURL=i_selectable_toolbox_item.js.map