/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.VarRename');
import * as deprecation from '../utils/deprecation.js';
import * as registry from '../registry.js';
import { VarBase } from './events_var_base.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners that a variable model was renamed.
 *
 * @class
 */
export class VarRename extends VarBase {
    /**
     * @param opt_variable The renamed variable. Undefined for a blank event.
     * @param newName The new name the variable will be changed to.
     */
    constructor(opt_variable, newName) {
        super(opt_variable);
        this.type = eventUtils.VAR_RENAME;
        if (!opt_variable) {
            return; // Blank event to be populated by fromJson.
        }
        this.oldName = opt_variable.name;
        this.newName = typeof newName === 'undefined' ? '' : newName;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (!this.oldName) {
            throw new Error('The old var name is undefined. Either pass a variable to ' +
                'the constructor, or call fromJson');
        }
        if (!this.newName) {
            throw new Error('The new var name is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        json['oldName'] = this.oldName;
        json['newName'] = this.newName;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.VarRename.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.oldName = json['oldName'];
        this.newName = json['newName'];
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of VarRename, but we can't specify that due to the fact that parameters
     *     to static methods in subclasses must be supertypes of parameters to
     *     static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new VarRename());
        newEvent.oldName = json['oldName'];
        newEvent.newName = json['newName'];
        return newEvent;
    }
    /**
     * Run a variable rename event.
     *
     * @param forward True if run forward, false if run backward (undo).
     */
    run(forward) {
        const workspace = this.getEventWorkspace_();
        if (!this.varId) {
            throw new Error('The var ID is undefined. Either pass a variable to ' +
                'the constructor, or call fromJson');
        }
        if (!this.oldName) {
            throw new Error('The old var name is undefined. Either pass a variable to ' +
                'the constructor, or call fromJson');
        }
        if (!this.newName) {
            throw new Error('The new var name is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        if (forward) {
            workspace.renameVariableById(this.varId, this.newName);
        }
        else {
            workspace.renameVariableById(this.varId, this.oldName);
        }
    }
}
registry.register(registry.Type.EVENT, eventUtils.VAR_RENAME, VarRename);
//# sourceMappingURL=events_var_rename.js.map