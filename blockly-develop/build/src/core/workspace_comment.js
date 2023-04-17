/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Object representing a code comment on the workspace.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.WorkspaceComment');
import * as eventUtils from './events/utils.js';
import { Coordinate } from './utils/coordinate.js';
import * as idGenerator from './utils/idgenerator.js';
import * as xml from './utils/xml.js';
/**
 * Class for a workspace comment.
 */
export class WorkspaceComment {
    /**
     * @param workspace The block's workspace.
     * @param content The content of this workspace comment.
     * @param height Height of the comment.
     * @param width Width of the comment.
     * @param opt_id Optional ID.  Use this ID if provided, otherwise create a new
     *     ID.
     */
    constructor(workspace, content, height, width, opt_id) {
        this.workspace = workspace;
        this.deletable = true;
        this.movable = true;
        this.editable = true;
        /** Whether this comment has been disposed. */
        this.disposed_ = false;
        /** @internal */
        this.isComment = true;
        this.id = opt_id && !workspace.getCommentById(opt_id) ?
            opt_id :
            idGenerator.genUid();
        workspace.addTopComment(this);
        /**
         * The comment's position in workspace units.  (0, 0) is at the workspace's
         * origin; scale does not change this value.
         */
        this.xy_ = new Coordinate(0, 0);
        /**
         * The comment's height in workspace units.  Scale does not change this
         * value.
         */
        this.height_ = height;
        /**
         * The comment's width in workspace units.  Scale does not change this
         * value.
         */
        this.width_ = width;
        this.RTL = workspace.RTL;
        this.content_ = content;
        WorkspaceComment.fireCreateEvent(this);
    }
    /**
     * Dispose of this comment.
     *
     * @internal
     */
    dispose() {
        if (this.disposed_) {
            return;
        }
        if (eventUtils.isEnabled()) {
            eventUtils.fire(new (eventUtils.get(eventUtils.COMMENT_DELETE))(this));
        }
        // Remove from the list of top comments and the comment database.
        this.workspace.removeTopComment(this);
        this.disposed_ = true;
    }
    // Height, width, x, and y are all stored on even non-rendered comments, to
    // preserve state if you pass the contents through a headless workspace.
    /**
     * Get comment height.
     *
     * @returns Comment height.
     * @internal
     */
    getHeight() {
        return this.height_;
    }
    /**
     * Set comment height.
     *
     * @param height Comment height.
     * @internal
     */
    setHeight(height) {
        this.height_ = height;
    }
    /**
     * Get comment width.
     *
     * @returns Comment width.
     * @internal
     */
    getWidth() {
        return this.width_;
    }
    /**
     * Set comment width.
     *
     * @param width comment width.
     * @internal
     */
    setWidth(width) {
        this.width_ = width;
    }
    /**
     * Get stored location.
     *
     * @returns The comment's stored location.
     *   This is not valid if the comment is currently being dragged.
     * @internal
     */
    getRelativeToSurfaceXY() {
        return new Coordinate(this.xy_.x, this.xy_.y);
    }
    /**
     * Move a comment by a relative offset.
     *
     * @param dx Horizontal offset, in workspace units.
     * @param dy Vertical offset, in workspace units.
     * @internal
     */
    moveBy(dx, dy) {
        const event = new (eventUtils.get(eventUtils.COMMENT_MOVE))(this);
        this.xy_.translate(dx, dy);
        event.recordNew();
        eventUtils.fire(event);
    }
    /**
     * Get whether this comment is deletable or not.
     *
     * @returns True if deletable.
     * @internal
     */
    isDeletable() {
        return this.deletable &&
            !(this.workspace && this.workspace.options.readOnly);
    }
    /**
     * Set whether this comment is deletable or not.
     *
     * @param deletable True if deletable.
     * @internal
     */
    setDeletable(deletable) {
        this.deletable = deletable;
    }
    /**
     * Get whether this comment is movable or not.
     *
     * @returns True if movable.
     * @internal
     */
    isMovable() {
        return this.movable && !(this.workspace && this.workspace.options.readOnly);
    }
    /**
     * Set whether this comment is movable or not.
     *
     * @param movable True if movable.
     * @internal
     */
    setMovable(movable) {
        this.movable = movable;
    }
    /**
     * Get whether this comment is editable or not.
     *
     * @returns True if editable.
     */
    isEditable() {
        return this.editable &&
            !(this.workspace && this.workspace.options.readOnly);
    }
    /**
     * Set whether this comment is editable or not.
     *
     * @param editable True if editable.
     */
    setEditable(editable) {
        this.editable = editable;
    }
    /**
     * Returns this comment's text.
     *
     * @returns Comment text.
     * @internal
     */
    getContent() {
        return this.content_;
    }
    /**
     * Set this comment's content.
     *
     * @param content Comment content.
     * @internal
     */
    setContent(content) {
        if (this.content_ !== content) {
            eventUtils.fire(new (eventUtils.get(eventUtils.COMMENT_CHANGE))(this, this.content_, content));
            this.content_ = content;
        }
    }
    /**
     * Encode a comment subtree as XML with XY coordinates.
     *
     * @param opt_noId True if the encoder should skip the comment ID.
     * @returns Tree of XML elements.
     * @internal
     */
    toXmlWithXY(opt_noId) {
        const element = this.toXml(opt_noId);
        element.setAttribute('x', String(Math.round(this.xy_.x)));
        element.setAttribute('y', String(Math.round(this.xy_.y)));
        element.setAttribute('h', String(this.height_));
        element.setAttribute('w', String(this.width_));
        return element;
    }
    /**
     * Encode a comment subtree as XML, but don't serialize the XY coordinates.
     * This method avoids some expensive metrics-related calls that are made in
     * toXmlWithXY().
     *
     * @param opt_noId True if the encoder should skip the comment ID.
     * @returns Tree of XML elements.
     * @internal
     */
    toXml(opt_noId) {
        const commentElement = xml.createElement('comment');
        if (!opt_noId) {
            commentElement.id = this.id;
        }
        commentElement.textContent = this.getContent();
        return commentElement;
    }
    /**
     * Fire a create event for the given workspace comment, if comments are
     * enabled.
     *
     * @param comment The comment that was just created.
     * @internal
     */
    static fireCreateEvent(comment) {
        if (eventUtils.isEnabled()) {
            const existingGroup = eventUtils.getGroup();
            if (!existingGroup) {
                eventUtils.setGroup(true);
            }
            try {
                eventUtils.fire(new (eventUtils.get(eventUtils.COMMENT_CREATE))(comment));
            }
            finally {
                eventUtils.setGroup(existingGroup);
            }
        }
    }
    /**
     * Decode an XML comment tag and create a comment on the workspace.
     *
     * @param xmlComment XML comment element.
     * @param workspace The workspace.
     * @returns The created workspace comment.
     * @internal
     */
    static fromXml(xmlComment, workspace) {
        const info = WorkspaceComment.parseAttributes(xmlComment);
        const comment = new WorkspaceComment(workspace, info.content, info.h, info.w, info.id);
        const xmlX = xmlComment.getAttribute('x');
        const xmlY = xmlComment.getAttribute('y');
        const commentX = xmlX ? parseInt(xmlX, 10) : NaN;
        const commentY = xmlY ? parseInt(xmlY, 10) : NaN;
        if (!isNaN(commentX) && !isNaN(commentY)) {
            comment.moveBy(commentX, commentY);
        }
        WorkspaceComment.fireCreateEvent(comment);
        return comment;
    }
    /**
     * Decode an XML comment tag and return the results in an object.
     *
     * @param xml XML comment element.
     * @returns An object containing the id, size, position, and comment string.
     * @internal
     */
    static parseAttributes(xml) {
        const xmlH = xml.getAttribute('h');
        const xmlW = xml.getAttribute('w');
        const xmlX = xml.getAttribute('x');
        const xmlY = xml.getAttribute('y');
        const xmlId = xml.getAttribute('id');
        if (!xmlId) {
            throw new Error('No ID present in XML comment definition.');
        }
        return {
            id: xmlId,
            // The height of the comment in workspace units, or 100 if not specified.
            h: xmlH ? parseInt(xmlH) : 100,
            // The width of the comment in workspace units, or 100 if not specified.
            w: xmlW ? parseInt(xmlW) : 100,
            // The x position of the comment in workspace coordinates, or NaN if not
            // specified in the XML.
            x: xmlX ? parseInt(xmlX) : NaN,
            // The y position of the comment in workspace coordinates, or NaN if not
            // specified in the XML.
            y: xmlY ? parseInt(xmlY) : NaN,
            content: xml.textContent ?? '',
        };
    }
}
//# sourceMappingURL=workspace_comment.js.map