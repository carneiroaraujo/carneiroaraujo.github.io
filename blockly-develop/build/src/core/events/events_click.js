/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Events fired as a result of UI click in Blockly's editor.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.Click');
import * as deprecation from '../utils/deprecation.js';
import * as registry from '../registry.js';
import { UiBase } from './events_ui_base.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners that ome blockly element was clicked.
 */
export class Click extends UiBase {
    /**
     * @param opt_block The affected block. Null for click events that do not have
     *     an associated block (i.e. workspace click). Undefined for a blank
     *     event.
     * @param opt_workspaceId The workspace identifier for this event.
     *    Not used if block is passed. Undefined for a blank event.
     * @param opt_targetType The type of element targeted by this click event.
     *     Undefined for a blank event.
     */
    constructor(opt_block, opt_workspaceId, opt_targetType) {
        let workspaceId = opt_block ? opt_block.workspace.id : opt_workspaceId;
        if (workspaceId === null) {
            workspaceId = undefined;
        }
        super(workspaceId);
        this.type = eventUtils.CLICK;
        this.blockId = opt_block ? opt_block.id : undefined;
        this.targetType = opt_targetType;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (!this.targetType) {
            throw new Error('The click target type is undefined. Either pass a block to ' +
                'the constructor, or call fromJson');
        }
        json['targetType'] = this.targetType;
        json['blockId'] = this.blockId;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.Click.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.targetType = json['targetType'];
        this.blockId = json['blockId'];
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of Click, but we can't specify that due to the fact that parameters to
     *     static methods in subclasses must be supertypes of parameters to
     *     static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new Click());
        newEvent.targetType = json['targetType'];
        newEvent.blockId = json['blockId'];
        return newEvent;
    }
}
export var ClickTarget;
(function (ClickTarget) {
    ClickTarget["BLOCK"] = "block";
    ClickTarget["WORKSPACE"] = "workspace";
    ClickTarget["ZOOM_CONTROLS"] = "zoom_controls";
})(ClickTarget || (ClickTarget = {}));
registry.register(registry.Type.EVENT, eventUtils.CLICK, Click);
//# sourceMappingURL=events_click.js.map