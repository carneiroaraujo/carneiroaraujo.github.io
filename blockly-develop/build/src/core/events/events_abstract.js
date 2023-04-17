/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Abstract class for events fired as a result of actions in
 * Blockly's editor.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.Abstract');
import * as deprecation from '../utils/deprecation.js';
import * as common from '../common.js';
import * as eventUtils from './utils.js';
/**
 * Abstract class for an event.
 */
export class Abstract {
    constructor() {
        /** The workspace identifier for this event. */
        this.workspaceId = undefined;
        /** Whether or not the event is a UI event. */
        this.isUiEvent = false;
        /** Type of this event. */
        this.type = '';
        this.group = eventUtils.getGroup();
        this.recordUndo = eventUtils.getRecordUndo();
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        return {
            'type': this.type,
            'group': this.group,
        };
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.Abstract.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        this.isBlank = false;
        this.group = json['group'] || '';
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of Abstract (like all events), but we can't specify that due to the
     *     fact that parameters to static methods in subclasses must be
     *     supertypes of parameters to static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        event.isBlank = false;
        event.group = json['group'] || '';
        event.workspaceId = workspace.id;
        return event;
    }
    /**
     * Does this event record any change of state?
     *
     * @returns True if null, false if something changed.
     */
    isNull() {
        return false;
    }
    /**
     * Run an event.
     *
     * @param _forward True if run forward, false if run backward (undo).
     */
    run(_forward) {
        // Defined by subclasses. Cannot be abstract b/c UI events do /not/ define
        // this.
    }
    /**
     * Get workspace the event belongs to.
     *
     * @returns The workspace the event belongs to.
     * @throws {Error} if workspace is null.
     * @internal
     */
    getEventWorkspace_() {
        let workspace;
        if (this.workspaceId) {
            workspace = common.getWorkspaceById(this.workspaceId);
        }
        if (!workspace) {
            throw Error('Workspace is null. Event must have been generated from real' +
                ' Blockly events.');
        }
        return workspace;
    }
}
//# sourceMappingURL=events_abstract.js.map