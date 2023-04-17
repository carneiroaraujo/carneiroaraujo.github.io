/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Class for a finished loading workspace event.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.FinishedLoading');
import * as registry from '../registry.js';
import { Abstract as AbstractEvent } from './events_abstract.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners when the workspace has finished deserializing from
 * JSON/XML.
 */
export class FinishedLoading extends AbstractEvent {
    /**
     * @param opt_workspace The workspace that has finished loading.  Undefined
     *     for a blank event.
     */
    constructor(opt_workspace) {
        super();
        this.isBlank = true;
        this.recordUndo = false;
        this.type = eventUtils.FINISHED_LOADING;
        this.isBlank = !!opt_workspace;
        if (!opt_workspace)
            return;
        this.workspaceId = opt_workspace.id;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (!this.workspaceId) {
            throw new Error('The workspace ID is undefined. Either pass a workspace to ' +
                'the constructor, or call fromJson');
        }
        json['workspaceId'] = this.workspaceId;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        super.fromJson(json);
        this.workspaceId = json['workspaceId'];
    }
}
registry.register(registry.Type.EVENT, eventUtils.FINISHED_LOADING, FinishedLoading);
//# sourceMappingURL=workspace_events.js.map