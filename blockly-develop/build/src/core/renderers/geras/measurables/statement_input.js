/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.geras.StatementInput');
import { StatementInput as BaseStatementInput } from '../../../renderers/measurables/statement_input.js';
/**
 * An object containing information about the space a statement input takes up
 * during rendering.
 */
export class StatementInput extends BaseStatementInput {
    /**
     * @param constants The rendering constants provider.
     * @param input The statement input to measure and store information for.
     */
    constructor(constants, input) {
        super(constants, input);
        this.constants_ = constants;
        if (this.connectedBlock) {
            // We allow the dark path to show on the parent block so that the child
            // block looks embossed.  This takes up an extra pixel in both x and y.
            this.height += this.constants_.DARK_PATH_OFFSET;
        }
    }
}
//# sourceMappingURL=statement_input.js.map