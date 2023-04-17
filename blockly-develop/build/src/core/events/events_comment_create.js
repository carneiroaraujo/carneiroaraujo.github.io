/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Class for comment creation event.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.CommentCreate');
import * as deprecation from '../utils/deprecation.js';
import * as registry from '../registry.js';
import * as utilsXml from '../utils/xml.js';
import * as Xml from '../xml.js';
import { CommentBase } from './events_comment_base.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners that a workspace comment was created.
 */
export class CommentCreate extends CommentBase {
    /**
     * @param opt_comment The created comment.
     *     Undefined for a blank event.
     */
    constructor(opt_comment) {
        super(opt_comment);
        this.type = eventUtils.COMMENT_CREATE;
        if (!opt_comment) {
            return;
        }
        // Blank event to be populated by fromJson.
        this.xml = opt_comment.toXmlWithXY();
    }
    // TODO (#1266): "Full" and "minimal" serialization.
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (!this.xml) {
            throw new Error('The comment XML is undefined. Either pass a comment to ' +
                'the constructor, or call fromJson');
        }
        json['xml'] = Xml.domToText(this.xml);
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.CommentCreate.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.xml = utilsXml.textToDom(json['xml']);
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of CommentCreate, but we can't specify that due to the fact that
     *     parameters to static methods in subclasses must be supertypes of
     *     parameters to static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new CommentCreate());
        newEvent.xml = utilsXml.textToDom(json['xml']);
        return newEvent;
    }
    /**
     * Run a creation event.
     *
     * @param forward True if run forward, false if run backward (undo).
     */
    run(forward) {
        CommentBase.CommentCreateDeleteHelper(this, forward);
    }
}
registry.register(registry.Type.EVENT, eventUtils.COMMENT_CREATE, CommentCreate);
//# sourceMappingURL=events_comment_create.js.map