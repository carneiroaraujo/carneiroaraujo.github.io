/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Events fired as a result of a viewport change.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.ViewportChange');
import * as deprecation from '../utils/deprecation.js';
import * as registry from '../registry.js';
import { UiBase } from './events_ui_base.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners that the workspace surface's position or scale has
 * changed.
 *
 * Does not notify when the workspace itself resizes.
 */
export class ViewportChange extends UiBase {
    /**
     * @param opt_top Top-edge of the visible portion of the workspace, relative
     *     to the workspace origin. Undefined for a blank event.
     * @param opt_left Left-edge of the visible portion of the workspace relative
     *     to the workspace origin. Undefined for a blank event.
     * @param opt_scale The scale of the workspace. Undefined for a blank event.
     * @param opt_workspaceId The workspace identifier for this event.
     *    Undefined for a blank event.
     * @param opt_oldScale The old scale of the workspace. Undefined for a blank
     *     event.
     */
    constructor(opt_top, opt_left, opt_scale, opt_workspaceId, opt_oldScale) {
        super(opt_workspaceId);
        this.type = eventUtils.VIEWPORT_CHANGE;
        this.viewTop = opt_top;
        this.viewLeft = opt_left;
        this.scale = opt_scale;
        this.oldScale = opt_oldScale;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (this.viewTop === undefined) {
            throw new Error('The view top is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        if (this.viewLeft === undefined) {
            throw new Error('The view left is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        if (this.scale === undefined) {
            throw new Error('The scale is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        if (this.oldScale === undefined) {
            throw new Error('The old scale is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        json['viewTop'] = this.viewTop;
        json['viewLeft'] = this.viewLeft;
        json['scale'] = this.scale;
        json['oldScale'] = this.oldScale;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.Viewport.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.viewTop = json['viewTop'];
        this.viewLeft = json['viewLeft'];
        this.scale = json['scale'];
        this.oldScale = json['oldScale'];
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of Viewport, but we can't specify that due to the fact that parameters
     *     to static methods in subclasses must be supertypes of parameters to
     *     static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new ViewportChange());
        newEvent.viewTop = json['viewTop'];
        newEvent.viewLeft = json['viewLeft'];
        newEvent.scale = json['scale'];
        newEvent.oldScale = json['oldScale'];
        return newEvent;
    }
}
registry.register(registry.Type.EVENT, eventUtils.VIEWPORT_CHANGE, ViewportChange);
//# sourceMappingURL=events_viewport.js.map