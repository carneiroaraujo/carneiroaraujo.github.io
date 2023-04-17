/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Non-editable, non-serializable text field.  Used for titles,
 *    labels, etc.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.FieldLabel');
import * as dom from './utils/dom.js';
import { Field } from './field.js';
import * as fieldRegistry from './field_registry.js';
import * as parsing from './utils/parsing.js';
/**
 * Class for a non-editable, non-serializable text field.
 */
export class FieldLabel extends Field {
    /**
     * @param value The initial value of the field. Should cast to a string.
     *     Defaults to an empty string if null or undefined. Also accepts
     *     Field.SKIP_SETUP if you wish to skip setup (only used by subclasses
     *     that want to handle configuration and setting the field value after
     *     their own constructors have run).
     * @param textClass Optional CSS class for the field's text.
     * @param config A map of options used to configure the field.
     *    See the [field creation documentation]{@link
     * https://developers.google.com/blockly/guides/create-custom-blocks/fields/built-in-fields/label#creation}
     * for a list of properties this parameter supports.
     */
    constructor(value, textClass, config) {
        super(Field.SKIP_SETUP);
        /** The HTML class name to use for this field. */
        this.class_ = null;
        /**
         * Editable fields usually show some sort of UI indicating they are
         * editable. This field should not.
         */
        this.EDITABLE = false;
        if (value === Field.SKIP_SETUP)
            return;
        if (config) {
            this.configure_(config);
        }
        else {
            this.class_ = textClass || null;
        }
        this.setValue(value);
    }
    configure_(config) {
        super.configure_(config);
        if (config.class)
            this.class_ = config.class;
    }
    /**
     * Create block UI for this label.
     *
     * @internal
     */
    initView() {
        this.createTextElement_();
        if (this.class_) {
            dom.addClass(this.getTextElement(), this.class_);
        }
    }
    /**
     * Ensure that the input value casts to a valid string.
     *
     * @param newValue The input value.
     * @returns A valid string, or null if invalid.
     */
    doClassValidation_(newValue) {
        if (newValue === null || newValue === undefined) {
            return null;
        }
        return `${newValue}`;
    }
    /**
     * Set the CSS class applied to the field's textElement_.
     *
     * @param cssClass The new CSS class name, or null to remove.
     */
    setClass(cssClass) {
        if (this.textElement_) {
            if (this.class_) {
                dom.removeClass(this.textElement_, this.class_);
            }
            if (cssClass) {
                dom.addClass(this.textElement_, cssClass);
            }
        }
        this.class_ = cssClass;
    }
    /**
     * Construct a FieldLabel from a JSON arg object,
     * dereferencing any string table references.
     *
     * @param options A JSON object with options (text, and class).
     * @returns The new field instance.
     * @nocollapse
     * @internal
     */
    static fromJson(options) {
        const text = parsing.replaceMessageReferences(options.text);
        // `this` might be a subclass of FieldLabel if that class doesn't override
        // the static fromJson method.
        return new this(text, undefined, options);
    }
}
fieldRegistry.register('field_label', FieldLabel);
FieldLabel.prototype.DEFAULT_VALUE = '';
//# sourceMappingURL=field_label.js.map