/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Block } from '../block.js';
import { UiBase } from './events_ui_base.js';
/**
 * Class for a UI event.
 *
 * @deprecated December 2020. Instead use a more specific UI event.
 */
export declare class Ui extends UiBase {
    blockId: AnyDuringMigration;
    element: AnyDuringMigration;
    oldValue: AnyDuringMigration;
    newValue: AnyDuringMigration;
    type: string;
    /**
     * @param opt_block The affected block.  Null for UI events that do not have
     *     an associated block.  Undefined for a blank event.
     * @param opt_element One of 'selected', 'comment', 'mutatorOpen', etc.
     * @param opt_oldValue Previous value of element.
     * @param opt_newValue New value of element.
     */
    constructor(opt_block?: Block | null, opt_element?: string, opt_oldValue?: AnyDuringMigration, opt_newValue?: AnyDuringMigration);
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson(): AnyDuringMigration;
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json: AnyDuringMigration): void;
}
//# sourceMappingURL=events_ui.d.ts.map