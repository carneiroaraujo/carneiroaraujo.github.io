/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Events fired as a result of a marker move.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.MarkerMove');
import { ASTNode } from '../keyboard_nav/ast_node.js';
import * as deprecation from '../utils/deprecation.js';
import * as registry from '../registry.js';
import { UiBase } from './events_ui_base.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners that a marker (used for keyboard navigation) has
 * moved.
 */
export class MarkerMove extends UiBase {
    /**
     * @param opt_block The affected block. Null if current node is of type
     *     workspace. Undefined for a blank event.
     * @param isCursor Whether this is a cursor event. Undefined for a blank
     *     event.
     * @param opt_oldNode The old node the marker used to be on.
     *    Undefined for a blank event.
     * @param opt_newNode The new node the marker is now on.
     *    Undefined for a blank event.
     */
    constructor(opt_block, isCursor, opt_oldNode, opt_newNode) {
        let workspaceId = opt_block ? opt_block.workspace.id : undefined;
        if (opt_newNode && opt_newNode.getType() === ASTNode.types.WORKSPACE) {
            workspaceId = opt_newNode.getLocation().id;
        }
        super(workspaceId);
        this.type = eventUtils.MARKER_MOVE;
        this.blockId = opt_block?.id;
        this.oldNode = opt_oldNode || undefined;
        this.newNode = opt_newNode;
        this.isCursor = isCursor;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (this.isCursor === undefined) {
            throw new Error('Whether this is a cursor event or not is undefined. Either pass ' +
                'a value to the constructor, or call fromJson');
        }
        if (!this.newNode) {
            throw new Error('The new node is undefined. Either pass a node to ' +
                'the constructor, or call fromJson');
        }
        json['isCursor'] = this.isCursor;
        json['blockId'] = this.blockId;
        json['oldNode'] = this.oldNode;
        json['newNode'] = this.newNode;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.MarkerMove.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.isCursor = json['isCursor'];
        this.blockId = json['blockId'];
        this.oldNode = json['oldNode'];
        this.newNode = json['newNode'];
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of MarkerMove, but we can't specify that due to the fact that
     *     parameters to static methods in subclasses must be supertypes of
     *     parameters to static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new MarkerMove());
        newEvent.isCursor = json['isCursor'];
        newEvent.blockId = json['blockId'];
        newEvent.oldNode = json['oldNode'];
        newEvent.newNode = json['newNode'];
        return newEvent;
    }
}
registry.register(registry.Type.EVENT, eventUtils.MARKER_MOVE, MarkerMove);
//# sourceMappingURL=events_marker_move.js.map