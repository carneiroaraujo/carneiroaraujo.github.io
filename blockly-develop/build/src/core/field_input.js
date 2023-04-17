/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Text input field.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.FieldInput');
// Unused import preserved for side-effects. Remove if unneeded.
import './events/events_block_change.js';
import * as browserEvents from './browser_events.js';
import * as dialog from './dialog.js';
import * as dom from './utils/dom.js';
import * as dropDownDiv from './dropdowndiv.js';
import * as eventUtils from './events/utils.js';
import { Field, UnattachedFieldError } from './field.js';
import { Msg } from './msg.js';
import * as aria from './utils/aria.js';
import { Coordinate } from './utils/coordinate.js';
import * as userAgent from './utils/useragent.js';
import * as WidgetDiv from './widgetdiv.js';
/**
 * Abstract class for an editable input field.
 *
 * @typeParam T - The value stored on the field.
 * @internal
 */
class FieldInput extends Field {
    /**
     * @param value The initial value of the field. Should cast to a string.
     *     Defaults to an empty string if null or undefined. Also accepts
     *     Field.SKIP_SETUP if you wish to skip setup (only used by subclasses
     *     that want to handle configuration and setting the field value after
     *     their own constructors have run).
     * @param validator A function that is called to validate changes to the
     *     field's value. Takes in a string & returns a validated string, or null
     *     to abort the change.
     * @param config A map of options used to configure the field.
     *     See the [field creation documentation]{@link
     * https://developers.google.com/blockly/guides/create-custom-blocks/fields/built-in-fields/text-input#creation}
     * for a list of properties this parameter supports.
     */
    constructor(value, validator, config) {
        super(Field.SKIP_SETUP);
        /** Allow browser to spellcheck this field. */
        this.spellcheck_ = true;
        /** The HTML input element. */
        this.htmlInput_ = null;
        /** True if the field's value is currently being edited via the UI. */
        this.isBeingEdited_ = false;
        /**
         * True if the value currently displayed in the field's editory UI is valid.
         */
        this.isTextValid_ = false;
        /** Key down event data. */
        this.onKeyDownWrapper_ = null;
        /** Key input event data. */
        this.onKeyInputWrapper_ = null;
        /**
         * Whether the field should consider the whole parent block to be its click
         * target.
         */
        this.fullBlockClickTarget_ = false;
        /** The workspace that this field belongs to. */
        this.workspace_ = null;
        /**
         * Serializable fields are saved by the serializer, non-serializable fields
         * are not. Editable fields should also be serializable.
         */
        this.SERIALIZABLE = true;
        /** Mouse cursor style when over the hotspot that initiates the editor. */
        this.CURSOR = 'text';
        if (value === Field.SKIP_SETUP)
            return;
        if (config) {
            this.configure_(config);
        }
        this.setValue(value);
        if (validator) {
            this.setValidator(validator);
        }
    }
    configure_(config) {
        super.configure_(config);
        if (config.spellcheck !== undefined) {
            this.spellcheck_ = config.spellcheck;
        }
    }
    /** @internal */
    initView() {
        const block = this.getSourceBlock();
        if (!block) {
            throw new UnattachedFieldError();
        }
        if (this.getConstants().FULL_BLOCK_FIELDS) {
            // Step one: figure out if this is the only field on this block.
            // Rendering is quite different in that case.
            let nFields = 0;
            let nConnections = 0;
            // Count the number of fields, excluding text fields
            for (let i = 0, input; input = block.inputList[i]; i++) {
                for (let j = 0; input.fieldRow[j]; j++) {
                    nFields++;
                }
                if (input.connection) {
                    nConnections++;
                }
            }
            // The special case is when this is the only non-label field on the block
            // and it has an output but no inputs.
            this.fullBlockClickTarget_ =
                nFields <= 1 && block.outputConnection && !nConnections;
        }
        else {
            this.fullBlockClickTarget_ = false;
        }
        if (this.fullBlockClickTarget_) {
            this.clickTarget_ = this.sourceBlock_.getSvgRoot();
        }
        else {
            this.createBorderRect_();
        }
        this.createTextElement_();
    }
    /**
     * Called by setValue if the text input is not valid. If the field is
     * currently being edited it reverts value of the field to the previous
     * value while allowing the display text to be handled by the htmlInput_.
     *
     * @param _invalidValue The input value that was determined to be invalid.
     *    This is not used by the text input because its display value is stored
     * on the htmlInput_.
     */
    doValueInvalid_(_invalidValue) {
        if (this.isBeingEdited_) {
            this.isDirty_ = true;
            this.isTextValid_ = false;
            const oldValue = this.value_;
            // Revert value when the text becomes invalid.
            this.value_ = this.htmlInput_.getAttribute('data-untyped-default-value');
            if (this.sourceBlock_ && eventUtils.isEnabled()) {
                eventUtils.fire(new (eventUtils.get(eventUtils.BLOCK_CHANGE))(this.sourceBlock_, 'field', this.name || null, oldValue, this.value_));
            }
        }
    }
    /**
     * Called by setValue if the text input is valid. Updates the value of the
     * field, and updates the text of the field if it is not currently being
     * edited (i.e. handled by the htmlInput_).
     *
     * @param newValue The value to be saved. The default validator guarantees
     *     that this is a string.
     */
    doValueUpdate_(newValue) {
        this.isDirty_ = true;
        this.isTextValid_ = true;
        this.value_ = newValue;
    }
    /**
     * Updates text field to match the colour/style of the block.
     *
     * @internal
     */
    applyColour() {
        if (!this.sourceBlock_ || !this.getConstants().FULL_BLOCK_FIELDS)
            return;
        const source = this.sourceBlock_;
        if (this.borderRect_) {
            this.borderRect_.setAttribute('stroke', source.style.colourTertiary);
        }
        else {
            source.pathObject.svgPath.setAttribute('fill', this.getConstants().FIELD_BORDER_RECT_COLOUR);
        }
    }
    /**
     * Updates the colour of the htmlInput given the current validity of the
     * field's value.
     */
    render_() {
        super.render_();
        // This logic is done in render_ rather than doValueInvalid_ or
        // doValueUpdate_ so that the code is more centralized.
        if (this.isBeingEdited_) {
            this.resizeEditor_();
            const htmlInput = this.htmlInput_;
            if (!this.isTextValid_) {
                dom.addClass(htmlInput, 'blocklyInvalidInput');
                aria.setState(htmlInput, aria.State.INVALID, true);
            }
            else {
                dom.removeClass(htmlInput, 'blocklyInvalidInput');
                aria.setState(htmlInput, aria.State.INVALID, false);
            }
        }
    }
    /**
     * Set whether this field is spellchecked by the browser.
     *
     * @param check True if checked.
     */
    setSpellcheck(check) {
        if (check === this.spellcheck_) {
            return;
        }
        this.spellcheck_ = check;
        if (this.htmlInput_) {
            // AnyDuringMigration because:  Argument of type 'boolean' is not
            // assignable to parameter of type 'string'.
            this.htmlInput_.setAttribute('spellcheck', this.spellcheck_);
        }
    }
    /**
     * Show an editor for the field.
     * Shows the inline free-text editor on top of the text by default.
     * Shows a prompt editor for mobile browsers if the modalInputs option is
     * enabled.
     *
     * @param _e Optional mouse event that triggered the field to open, or
     *     undefined if triggered programmatically.
     * @param quietInput True if editor should be created without focus.
     *     Defaults to false.
     */
    showEditor_(_e, quietInput = false) {
        this.workspace_ = this.sourceBlock_.workspace;
        if (!quietInput && this.workspace_.options.modalInputs &&
            (userAgent.MOBILE || userAgent.ANDROID || userAgent.IPAD)) {
            this.showPromptEditor_();
        }
        else {
            this.showInlineEditor_(quietInput);
        }
    }
    /**
     * Create and show a text input editor that is a prompt (usually a popup).
     * Mobile browsers may have issues with in-line textareas (focus and
     * keyboards).
     */
    showPromptEditor_() {
        dialog.prompt(Msg['CHANGE_VALUE_TITLE'], this.getText(), (text) => {
            // Text is null if user pressed cancel button.
            if (text !== null) {
                this.setValue(this.getValueFromEditorText_(text));
            }
        });
    }
    /**
     * Create and show a text input editor that sits directly over the text input.
     *
     * @param quietInput True if editor should be created without focus.
     */
    showInlineEditor_(quietInput) {
        const block = this.getSourceBlock();
        if (!block) {
            throw new UnattachedFieldError();
        }
        WidgetDiv.show(this, block.RTL, this.widgetDispose_.bind(this));
        this.htmlInput_ = this.widgetCreate_();
        this.isBeingEdited_ = true;
        if (!quietInput) {
            this.htmlInput_.focus({
                preventScroll: true,
            });
            this.htmlInput_.select();
        }
    }
    /**
     * Create the text input editor widget.
     *
     * @returns The newly created text input editor.
     */
    widgetCreate_() {
        const block = this.getSourceBlock();
        if (!block) {
            throw new UnattachedFieldError();
        }
        eventUtils.setGroup(true);
        const div = WidgetDiv.getDiv();
        const clickTarget = this.getClickTarget_();
        if (!clickTarget)
            throw new Error('A click target has not been set.');
        dom.addClass(clickTarget, 'editing');
        const htmlInput = (document.createElement('input'));
        htmlInput.className = 'blocklyHtmlInput';
        // AnyDuringMigration because:  Argument of type 'boolean' is not assignable
        // to parameter of type 'string'.
        htmlInput.setAttribute('spellcheck', this.spellcheck_);
        const scale = this.workspace_.getScale();
        const fontSize = this.getConstants().FIELD_TEXT_FONTSIZE * scale + 'pt';
        div.style.fontSize = fontSize;
        htmlInput.style.fontSize = fontSize;
        let borderRadius = FieldInput.BORDERRADIUS * scale + 'px';
        if (this.fullBlockClickTarget_) {
            const bBox = this.getScaledBBox();
            // Override border radius.
            borderRadius = (bBox.bottom - bBox.top) / 2 + 'px';
            // Pull stroke colour from the existing shadow block
            const strokeColour = block.getParent() ?
                block.getParent().style.colourTertiary :
                this.sourceBlock_.style.colourTertiary;
            htmlInput.style.border = 1 * scale + 'px solid ' + strokeColour;
            div.style.borderRadius = borderRadius;
            div.style.transition = 'box-shadow 0.25s ease 0s';
            if (this.getConstants().FIELD_TEXTINPUT_BOX_SHADOW) {
                div.style.boxShadow =
                    'rgba(255, 255, 255, 0.3) 0 0 0 ' + (4 * scale) + 'px';
            }
        }
        htmlInput.style.borderRadius = borderRadius;
        div.appendChild(htmlInput);
        htmlInput.value = htmlInput.defaultValue = this.getEditorText_(this.value_);
        htmlInput.setAttribute('data-untyped-default-value', String(this.value_));
        this.resizeEditor_();
        this.bindInputEvents_(htmlInput);
        return htmlInput;
    }
    /**
     * Closes the editor, saves the results, and disposes of any events or
     * DOM-references belonging to the editor.
     */
    widgetDispose_() {
        // Non-disposal related things that we do when the editor closes.
        this.isBeingEdited_ = false;
        this.isTextValid_ = true;
        // Make sure the field's node matches the field's internal value.
        this.forceRerender();
        this.onFinishEditing_(this.value_);
        eventUtils.setGroup(false);
        // Actual disposal.
        this.unbindInputEvents_();
        const style = WidgetDiv.getDiv().style;
        style.width = 'auto';
        style.height = 'auto';
        style.fontSize = '';
        style.transition = '';
        style.boxShadow = '';
        this.htmlInput_ = null;
        const clickTarget = this.getClickTarget_();
        if (!clickTarget)
            throw new Error('A click target has not been set.');
        dom.removeClass(clickTarget, 'editing');
    }
    /**
     * A callback triggered when the user is done editing the field via the UI.
     *
     * @param _value The new value of the field.
     */
    onFinishEditing_(_value) { }
    // NOP by default.
    // TODO(#2496): Support people passing a func into the field.
    /**
     * Bind handlers for user input on the text input field's editor.
     *
     * @param htmlInput The htmlInput to which event handlers will be bound.
     */
    bindInputEvents_(htmlInput) {
        // Trap Enter without IME and Esc to hide.
        this.onKeyDownWrapper_ = browserEvents.conditionalBind(htmlInput, 'keydown', this, this.onHtmlInputKeyDown_);
        // Resize after every input change.
        this.onKeyInputWrapper_ = browserEvents.conditionalBind(htmlInput, 'input', this, this.onHtmlInputChange_);
    }
    /** Unbind handlers for user input and workspace size changes. */
    unbindInputEvents_() {
        if (this.onKeyDownWrapper_) {
            browserEvents.unbind(this.onKeyDownWrapper_);
            this.onKeyDownWrapper_ = null;
        }
        if (this.onKeyInputWrapper_) {
            browserEvents.unbind(this.onKeyInputWrapper_);
            this.onKeyInputWrapper_ = null;
        }
    }
    /**
     * Handle key down to the editor.
     *
     * @param e Keyboard event.
     */
    onHtmlInputKeyDown_(e) {
        if (e.key === 'Enter') {
            WidgetDiv.hide();
            dropDownDiv.hideWithoutAnimation();
        }
        else if (e.key === 'Escape') {
            this.setValue(this.htmlInput_.getAttribute('data-untyped-default-value'));
            WidgetDiv.hide();
            dropDownDiv.hideWithoutAnimation();
        }
        else if (e.key === 'Tab') {
            WidgetDiv.hide();
            dropDownDiv.hideWithoutAnimation();
            this.sourceBlock_.tab(this, !e.shiftKey);
            e.preventDefault();
        }
    }
    /**
     * Handle a change to the editor.
     *
     * @param _e Keyboard event.
     */
    onHtmlInputChange_(_e) {
        this.setValue(this.getValueFromEditorText_(this.htmlInput_.value));
    }
    /**
     * Set the HTML input value and the field's internal value. The difference
     * between this and `setValue` is that this also updates the HTML input
     * value whilst editing.
     *
     * @param newValue New value.
     */
    setEditorValue_(newValue) {
        this.isDirty_ = true;
        if (this.isBeingEdited_) {
            // In the case this method is passed an invalid value, we still
            // pass it through the transformation method `getEditorText` to deal
            // with. Otherwise, the internal field's state will be inconsistent
            // with what's shown to the user.
            this.htmlInput_.value = this.getEditorText_(newValue);
        }
        this.setValue(newValue);
    }
    /** Resize the editor to fit the text. */
    resizeEditor_() {
        const block = this.getSourceBlock();
        if (!block) {
            throw new UnattachedFieldError();
        }
        const div = WidgetDiv.getDiv();
        const bBox = this.getScaledBBox();
        div.style.width = bBox.right - bBox.left + 'px';
        div.style.height = bBox.bottom - bBox.top + 'px';
        // In RTL mode block fields and LTR input fields the left edge moves,
        // whereas the right edge is fixed.  Reposition the editor.
        const x = block.RTL ? bBox.right - div.offsetWidth : bBox.left;
        const xy = new Coordinate(x, bBox.top);
        div.style.left = xy.x + 'px';
        div.style.top = xy.y + 'px';
    }
    /**
     * Returns whether or not the field is tab navigable.
     *
     * @returns True if the field is tab navigable.
     */
    isTabNavigable() {
        return true;
    }
    /**
     * Use the `getText_` developer hook to override the field's text
     * representation. When we're currently editing, return the current HTML value
     * instead. Otherwise, return null which tells the field to use the default
     * behaviour (which is a string cast of the field's value).
     *
     * @returns The HTML value if we're editing, otherwise null.
     */
    getText_() {
        if (this.isBeingEdited_ && this.htmlInput_) {
            // We are currently editing, return the HTML input value instead.
            return this.htmlInput_.value;
        }
        return null;
    }
    /**
     * Transform the provided value into a text to show in the HTML input.
     * Override this method if the field's HTML input representation is different
     * than the field's value. This should be coupled with an override of
     * `getValueFromEditorText_`.
     *
     * @param value The value stored in this field.
     * @returns The text to show on the HTML input.
     */
    getEditorText_(value) {
        return `${value}`;
    }
    /**
     * Transform the text received from the HTML input into a value to store
     * in this field.
     * Override this method if the field's HTML input representation is different
     * than the field's value. This should be coupled with an override of
     * `getEditorText_`.
     *
     * @param text Text received from the HTML input.
     * @returns The value to store.
     */
    getValueFromEditorText_(text) {
        return text;
    }
}
/**
 * Pixel size of input border radius.
 * Should match blocklyText's border-radius in CSS.
 */
FieldInput.BORDERRADIUS = 4;
export { FieldInput };
//# sourceMappingURL=field_input.js.map