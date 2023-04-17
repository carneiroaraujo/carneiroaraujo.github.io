/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Class for a block change event.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.Events.BlockChange');
import * as deprecation from '../utils/deprecation.js';
import * as registry from '../registry.js';
import * as utilsXml from '../utils/xml.js';
import * as Xml from '../xml.js';
import { BlockBase } from './events_block_base.js';
import * as eventUtils from './utils.js';
/**
 * Notifies listeners when some element of a block has changed (e.g.
 * field values, comments, etc).
 */
export class BlockChange extends BlockBase {
    /**
     * @param opt_block The changed block.  Undefined for a blank event.
     * @param opt_element One of 'field', 'comment', 'disabled', etc.
     * @param opt_name Name of input or field affected, or null.
     * @param opt_oldValue Previous value of element.
     * @param opt_newValue New value of element.
     */
    constructor(opt_block, opt_element, opt_name, opt_oldValue, opt_newValue) {
        super(opt_block);
        this.type = eventUtils.BLOCK_CHANGE;
        if (!opt_block) {
            return; // Blank event to be populated by fromJson.
        }
        this.element = opt_element;
        this.name = opt_name || undefined;
        this.oldValue = opt_oldValue;
        this.newValue = opt_newValue;
    }
    /**
     * Encode the event as JSON.
     *
     * @returns JSON representation.
     */
    toJson() {
        const json = super.toJson();
        if (!this.element) {
            throw new Error('The changed element is undefined. Either pass an ' +
                'element to the constructor, or call fromJson');
        }
        json['element'] = this.element;
        json['name'] = this.name;
        json['oldValue'] = this.oldValue;
        json['newValue'] = this.newValue;
        return json;
    }
    /**
     * Decode the JSON event.
     *
     * @param json JSON representation.
     */
    fromJson(json) {
        deprecation.warn('Blockly.Events.BlockChange.prototype.fromJson', 'version 9', 'version 10', 'Blockly.Events.fromJson');
        super.fromJson(json);
        this.element = json['element'];
        this.name = json['name'];
        this.oldValue = json['oldValue'];
        this.newValue = json['newValue'];
    }
    /**
     * Deserializes the JSON event.
     *
     * @param event The event to append new properties to. Should be a subclass
     *     of BlockChange, but we can't specify that due to the fact that
     *     parameters to static methods in subclasses must be supertypes of
     *     parameters to static methods in superclasses.
     * @internal
     */
    static fromJson(json, workspace, event) {
        const newEvent = super.fromJson(json, workspace, event ?? new BlockChange());
        newEvent.element = json['element'];
        newEvent.name = json['name'];
        newEvent.oldValue = json['oldValue'];
        newEvent.newValue = json['newValue'];
        return newEvent;
    }
    /**
     * Does this event record any change of state?
     *
     * @returns False if something changed.
     */
    isNull() {
        return this.oldValue === this.newValue;
    }
    /**
     * Run a change event.
     *
     * @param forward True if run forward, false if run backward (undo).
     */
    run(forward) {
        const workspace = this.getEventWorkspace_();
        if (!this.blockId) {
            throw new Error('The block ID is undefined. Either pass a block to ' +
                'the constructor, or call fromJson');
        }
        const block = workspace.getBlockById(this.blockId);
        if (!block) {
            throw new Error('The associated block is undefined. Either pass a ' +
                'block to the constructor, or call fromJson');
        }
        // Assume the block is rendered so that then we can check.
        const blockSvg = block;
        if (blockSvg.mutator) {
            // Close the mutator (if open) since we don't want to update it.
            blockSvg.mutator.setVisible(false);
        }
        const value = forward ? this.newValue : this.oldValue;
        switch (this.element) {
            case 'field': {
                const field = block.getField(this.name);
                if (field) {
                    field.setValue(value);
                }
                else {
                    console.warn('Can\'t set non-existent field: ' + this.name);
                }
                break;
            }
            case 'comment':
                block.setCommentText(value || null);
                break;
            case 'collapsed':
                block.setCollapsed(!!value);
                break;
            case 'disabled':
                block.setEnabled(!value);
                break;
            case 'inline':
                block.setInputsInline(!!value);
                break;
            case 'mutation': {
                const oldState = BlockChange.getExtraBlockState_(block);
                if (block.loadExtraState) {
                    block.loadExtraState(JSON.parse(value || '{}'));
                }
                else if (block.domToMutation) {
                    block.domToMutation(utilsXml.textToDom(value || '<mutation/>'));
                }
                eventUtils.fire(new BlockChange(block, 'mutation', null, oldState, value));
                break;
            }
            default:
                console.warn('Unknown change type: ' + this.element);
        }
    }
    // TODO (#5397): Encapsulate this in the BlocklyMutationChange event when
    //    refactoring change events.
    /**
     * Returns the extra state of the given block (either as XML or a JSO,
     * depending on the block's definition).
     *
     * @param block The block to get the extra state of.
     * @returns A stringified version of the extra state of the given block.
     * @internal
     */
    static getExtraBlockState_(block) {
        if (block.saveExtraState) {
            const state = block.saveExtraState();
            return state ? JSON.stringify(state) : '';
        }
        else if (block.mutationToDom) {
            const state = block.mutationToDom();
            return state ? Xml.domToText(state) : '';
        }
        return '';
    }
}
registry.register(registry.Type.EVENT, eventUtils.CHANGE, BlockChange);
//# sourceMappingURL=events_block_change.js.map