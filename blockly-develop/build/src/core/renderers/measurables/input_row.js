/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.blockRendering.InputRow');
import { ExternalValueInput } from './external_value_input.js';
import { InputConnection } from './input_connection.js';
import { Row } from './row.js';
import { StatementInput } from './statement_input.js';
import { Types } from './types.js';
/**
 * An object containing information about a row that holds one or more inputs.
 */
export class InputRow extends Row {
    /**
     * @param constants The rendering constants provider.
     */
    constructor(constants) {
        super(constants);
        /**
         * The total width of all blocks connected to this row.
         */
        this.connectedBlockWidths = 0;
        this.type |= Types.INPUT_ROW;
    }
    /**
     * Inspect all subcomponents and populate all size properties on the row.
     */
    measure() {
        this.width = this.minWidth;
        this.height = this.minHeight;
        let connectedBlockWidths = 0;
        for (let i = 0; i < this.elements.length; i++) {
            const elem = this.elements[i];
            this.width += elem.width;
            if (Types.isInput(elem) && elem instanceof InputConnection) {
                if (Types.isStatementInput(elem) && elem instanceof StatementInput) {
                    connectedBlockWidths += elem.connectedBlockWidth;
                }
                else if (Types.isExternalInput(elem) && elem instanceof ExternalValueInput &&
                    elem.connectedBlockWidth !== 0) {
                    connectedBlockWidths +=
                        elem.connectedBlockWidth - elem.connectionWidth;
                }
            }
            if (!Types.isSpacer(elem)) {
                this.height = Math.max(this.height, elem.height);
            }
        }
        this.connectedBlockWidths = connectedBlockWidths;
        this.widthWithConnectedBlocks = this.width + connectedBlockWidths;
    }
    endsWithElemSpacer() {
        return !this.hasExternalInput && !this.hasStatement;
    }
}
//# sourceMappingURL=input_row.js.map