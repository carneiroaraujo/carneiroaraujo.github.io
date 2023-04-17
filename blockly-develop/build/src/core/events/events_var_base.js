/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Abstract class for a variable event.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.VarBase');
import * as deprecation from '../utils/deprecation.js';
import { Abstract as AbstractEvent } from './events_abstract.js';
/**
 * Abstract class for a variable event.
 */
export class VarBase extends AbstractEvent {
    /**
     * @param opt_variable The variable this event corresponds to.  Undefined for
     *     a blank event.
     */
    constructor(opt_variable) {
        super();
        this.isBlank = true;
        this.isBlank = typeof opt_variable === 'undefined';
        if (!opt_variable)
            return;
        this.varId = opt_variable.getId();
        this.workspaceId = opt_variable.workspace.id;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (!this.varId) {
            throw new Error('The var ID is undefined. Either pass a variable to ' +
                'the constructor, or call fromJson');
        }
        json['varId'] = this.varId;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.VarBase.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.varId = json['varId'];
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of VarBase, but we can't specify that due to the fact that parameters
     *     to static methods in subclasses must be supertypes of parameters to
     *     static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new VarBase());
        newEvent.varId = json['varId'];
        return newEvent;
    }
}
//# sourceMappingURL=events_var_base.js.map