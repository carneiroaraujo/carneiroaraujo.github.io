/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Class for comment change event.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.CommentChange');
import * as deprecation from '../utils/deprecation.js';
import * as registry from '../registry.js';
import { CommentBase } from './events_comment_base.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners that the contents of a workspace comment has changed.
 */
export class CommentChange extends CommentBase {
    /**
     * @param opt_comment The comment that is being changed.  Undefined for a
     *     blank event.
     * @param opt_oldContents Previous contents of the comment.
     * @param opt_newContents New contents of the comment.
     */
    constructor(opt_comment, opt_oldContents, opt_newContents) {
        super(opt_comment);
        this.type = eventUtils.COMMENT_CHANGE;
        if (!opt_comment) {
            return; // Blank event to be populated by fromJson.
        }
        this.oldContents_ =
            typeof opt_oldContents === 'undefined' ? '' : opt_oldContents;
        this.newContents_ =
            typeof opt_newContents === 'undefined' ? '' : opt_newContents;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (!this.oldContents_) {
            throw new Error('The old contents is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        if (!this.newContents_) {
            throw new Error('The new contents is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        json['oldContents'] = this.oldContents_;
        json['newContents'] = this.newContents_;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.CommentChange.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.oldContents_ = json['oldContents'];
        this.newContents_ = json['newContents'];
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of CommentChange, but we can't specify that due to the fact that
     *     parameters to static methods in subclasses must be supertypes of
     *     parameters to static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new CommentChange());
        newEvent.oldContents_ = json['oldContents'];
        newEvent.newContents_ = json['newContents'];
        return newEvent;
    }
    /**
     * Does this event record any change of state?
     *
     * @returns False if something changed.
     */
    isNull() {
        return this.oldContents_ === this.newContents_;
    }
    /**
     * Run a change event.
     *
     * @param forward True if run forward, false if run backward (undo).
     */
    run(forward) {
        const workspace = this.getEventWorkspace_();
        if (!this.commentId) {
            throw new Error('The comment ID is undefined. Either pass a comment to ' +
                'the constructor, or call fromJson');
        }
        const comment = workspace.getCommentById(this.commentId);
        if (!comment) {
            console.warn('Can\'t change non-existent comment: ' + this.commentId);
            return;
        }
        const contents = forward ? this.newContents_ : this.oldContents_;
        if (!contents) {
            if (forward) {
                throw new Error('The new contents is undefined. Either pass a value to ' +
                    'the constructor, or call fromJson');
            }
            throw new Error('The old contents is undefined. Either pass a value to ' +
                'the constructor, or call fromJson');
        }
        comment.setContent(contents);
    }
}
registry.register(registry.Type.EVENT, eventUtils.COMMENT_CHANGE, CommentChange);
//# sourceMappingURL=events_comment_change.js.map