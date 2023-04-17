/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A toolbox category used to organize blocks in the toolbox.
 *
 * @class
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.ToolboxCategory');
import * as Css from '../css.js';
import * as registry from '../registry.js';
import * as aria from '../utils/aria.js';
import * as colourUtils from '../utils/colour.js';
import * as dom from '../utils/dom.js';
import * as parsing from '../utils/parsing.js';
import * as toolbox from '../utils/toolbox.js';
import { ToolboxItem } from './toolbox_item.js';
/**
 * Class for a category in a toolbox.
 */
class ToolboxCategory extends ToolboxItem {
    /**
     * @param categoryDef The information needed to create a category in the
     *     toolbox.
     * @param parentToolbox The parent toolbox for the category.
     * @param opt_parent The parent category or null if the category does not have
     *     a parent.
     */
    constructor(categoryDef, parentToolbox, opt_parent) {
        super(categoryDef, parentToolbox, opt_parent);
        /** The name that will be displayed on the category. */
        this.name_ = '';
        /** The colour of the category. */
        this.colour_ = '';
        /** The HTML container for the category. */
        this.htmlDiv_ = null;
        /** The HTML element for the category row. */
        this.rowDiv_ = null;
        /** The HTML element that holds children elements of the category row. */
        this.rowContents_ = null;
        /** The HTML element for the toolbox icon. */
        this.iconDom_ = null;
        /** The HTML element for the toolbox label. */
        this.labelDom_ = null;
        /** True if the category is meant to be hidden, false otherwise. */
        this.isHidden_ = false;
        /** True if this category is disabled, false otherwise. */
        this.isDisabled_ = false;
        /** The flyout items for this category. */
        this.flyoutItems_ = [];
        /** All the css class names that are used to create a category. */
        this.cssConfig_ = this.makeDefaultCssConfig_();
    }
    /**
     * Initializes the toolbox item.
     * This includes creating the DOM and updating the state of any items based
     * on the info object.
     * Init should be called immediately after the construction of the toolbox
     * item, to ensure that the category contents are properly parsed.
     */
    init() {
        this.parseCategoryDef_(this.toolboxItemDef_);
        this.parseContents_(this.toolboxItemDef_);
        this.createDom_();
        if (this.toolboxItemDef_['hidden'] === 'true') {
            this.hide();
        }
    }
    /**
     * Creates an object holding the default classes for a category.
     *
     * @returns The configuration object holding all the CSS classes for a
     *     category.
     */
    makeDefaultCssConfig_() {
        return {
            'container': 'blocklyToolboxCategory',
            'row': 'blocklyTreeRow',
            'rowcontentcontainer': 'blocklyTreeRowContentContainer',
            'icon': 'blocklyTreeIcon',
            'label': 'blocklyTreeLabel',
            'contents': 'blocklyToolboxContents',
            'selected': 'blocklyTreeSelected',
            'openicon': 'blocklyTreeIconOpen',
            'closedicon': 'blocklyTreeIconClosed',
        };
    }
    /**
     * Parses the contents array depending on if the category is a dynamic
     * category, or if its contents are meant to be shown in the flyout.
     *
     * @param categoryDef The information needed to create a category.
     */
    parseContents_(categoryDef) {
        if ('custom' in categoryDef) {
            this.flyoutItems_ = categoryDef['custom'];
        }
        else {
            const contents = categoryDef['contents'];
            if (!contents)
                return;
            for (let i = 0; i < contents.length; i++) {
                const itemDef = contents[i];
                const flyoutItem = itemDef;
                if (Array.isArray(this.flyoutItems_)) {
                    this.flyoutItems_.push(flyoutItem);
                }
            }
        }
    }
    /**
     * Parses the non-contents parts of the category def.
     *
     * @param categoryDef The information needed to create a category.
     */
    parseCategoryDef_(categoryDef) {
        this.name_ = 'name' in categoryDef ?
            parsing.replaceMessageReferences(categoryDef['name']) :
            '';
        this.colour_ = this.getColour_(categoryDef);
        Object.assign(this.cssConfig_, categoryDef['cssconfig'] || categoryDef['cssConfig']);
    }
    /**
     * Creates the DOM for the category.
     *
     * @returns The parent element for the category.
     */
    createDom_() {
        this.htmlDiv_ = this.createContainer_();
        aria.setRole(this.htmlDiv_, aria.Role.TREEITEM);
        aria.setState(this.htmlDiv_, aria.State.SELECTED, false);
        aria.setState(this.htmlDiv_, aria.State.LEVEL, this.level_);
        this.rowDiv_ = this.createRowContainer_();
        this.rowDiv_.style.pointerEvents = 'auto';
        this.htmlDiv_.appendChild(this.rowDiv_);
        this.rowContents_ = this.createRowContentsContainer_();
        this.rowContents_.style.pointerEvents = 'none';
        this.rowDiv_.appendChild(this.rowContents_);
        this.iconDom_ = this.createIconDom_();
        aria.setRole(this.iconDom_, aria.Role.PRESENTATION);
        this.rowContents_.appendChild(this.iconDom_);
        this.labelDom_ = this.createLabelDom_(this.name_);
        this.rowContents_.appendChild(this.labelDom_);
        const id = this.labelDom_.getAttribute('id');
        if (id) {
            aria.setState(this.htmlDiv_, aria.State.LABELLEDBY, id);
        }
        this.addColourBorder_(this.colour_);
        return this.htmlDiv_;
    }
    /**
     * Creates the container that holds the row and any subcategories.
     *
     * @returns The div that holds the icon and the label.
     */
    createContainer_() {
        const container = document.createElement('div');
        const className = this.cssConfig_['container'];
        if (className) {
            dom.addClass(container, className);
        }
        return container;
    }
    /**
     * Creates the parent of the contents container. All clicks will happen on
     * this div.
     *
     * @returns The div that holds the contents container.
     */
    createRowContainer_() {
        const rowDiv = document.createElement('div');
        const className = this.cssConfig_['row'];
        if (className) {
            dom.addClass(rowDiv, className);
        }
        const nestedPadding = `${ToolboxCategory.nestedPadding * this.getLevel()}px`;
        this.workspace_.RTL ? rowDiv.style.paddingRight = nestedPadding :
            rowDiv.style.paddingLeft = nestedPadding;
        return rowDiv;
    }
    /**
     * Creates the container for the label and icon.
     * This is necessary so we can set all subcategory pointer events to none.
     *
     * @returns The div that holds the icon and the label.
     */
    createRowContentsContainer_() {
        const contentsContainer = document.createElement('div');
        const className = this.cssConfig_['rowcontentcontainer'];
        if (className) {
            dom.addClass(contentsContainer, className);
        }
        return contentsContainer;
    }
    /**
     * Creates the span that holds the category icon.
     *
     * @returns The span that holds the category icon.
     */
    createIconDom_() {
        const toolboxIcon = document.createElement('span');
        if (!this.parentToolbox_.isHorizontal()) {
            const className = this.cssConfig_['icon'];
            if (className) {
                dom.addClass(toolboxIcon, className);
            }
        }
        toolboxIcon.style.display = 'inline-block';
        return toolboxIcon;
    }
    /**
     * Creates the span that holds the category label.
     * This should have an ID for accessibility purposes.
     *
     * @param name The name of the category.
     * @returns The span that holds the category label.
     */
    createLabelDom_(name) {
        const toolboxLabel = document.createElement('span');
        toolboxLabel.setAttribute('id', this.getId() + '.label');
        toolboxLabel.textContent = name;
        const className = this.cssConfig_['label'];
        if (className) {
            dom.addClass(toolboxLabel, className);
        }
        return toolboxLabel;
    }
    /** Updates the colour for this category. */
    refreshTheme() {
        this.colour_ = this.getColour_(this.toolboxItemDef_);
        this.addColourBorder_(this.colour_);
    }
    /**
     * Add the strip of colour to the toolbox category.
     *
     * @param colour The category colour.
     */
    addColourBorder_(colour) {
        if (colour) {
            const border = ToolboxCategory.borderWidth + 'px solid ' + (colour || '#ddd');
            if (this.workspace_.RTL) {
                this.rowDiv_.style.borderRight = border;
            }
            else {
                this.rowDiv_.style.borderLeft = border;
            }
        }
    }
    /**
     * Gets either the colour or the style for a category.
     *
     * @param categoryDef The object holding information on the category.
     * @returns The hex colour for the category.
     */
    getColour_(categoryDef) {
        const styleName = categoryDef['categorystyle'] || categoryDef['categoryStyle'];
        const colour = categoryDef['colour'];
        if (colour && styleName) {
            console.warn('Toolbox category "' + this.name_ +
                '" must not have both a style and a colour');
        }
        else if (styleName) {
            return this.getColourfromStyle_(styleName);
        }
        else if (colour) {
            return this.parseColour_(colour);
        }
        return '';
    }
    /**
     * Sets the colour for the category using the style name and returns the new
     * colour as a hex string.
     *
     * @param styleName Name of the style.
     * @returns The hex colour for the category.
     */
    getColourfromStyle_(styleName) {
        const theme = this.workspace_.getTheme();
        if (styleName && theme) {
            const style = theme.categoryStyles[styleName];
            if (style && style.colour) {
                return this.parseColour_(style.colour);
            }
            else {
                console.warn('Style "' + styleName + '" must exist and contain a colour value');
            }
        }
        return '';
    }
    /**
     * Gets the HTML element that is clickable.
     * The parent toolbox element receives clicks. The parent toolbox will add an
     * ID to this element so it can pass the onClick event to the correct
     * toolboxItem.
     *
     * @returns The HTML element that receives clicks.
     */
    getClickTarget() {
        return this.rowDiv_;
    }
    /**
     * Parses the colour on the category.
     *
     * @param colourValue HSV hue value (0 to 360), #RRGGBB string, or a message
     *     reference string pointing to one of those two values.
     * @returns The hex colour for the category.
     */
    parseColour_(colourValue) {
        // Decode the colour for any potential message references
        // (eg. `%{BKY_MATH_HUE}`).
        const colour = parsing.replaceMessageReferences(colourValue);
        if (colour == null || colour === '') {
            // No attribute. No colour.
            return '';
        }
        else {
            const hue = Number(colour);
            if (!isNaN(hue)) {
                return colourUtils.hueToHex(hue);
            }
            else {
                const hex = colourUtils.parse(colour);
                if (hex) {
                    return hex;
                }
                else {
                    console.warn('Toolbox category "' + this.name_ +
                        '" has unrecognized colour attribute: ' + colour);
                    return '';
                }
            }
        }
    }
    /**
     * Adds appropriate classes to display an open icon.
     *
     * @param iconDiv The div that holds the icon.
     */
    openIcon_(iconDiv) {
        if (!iconDiv) {
            return;
        }
        const closedIconClass = this.cssConfig_['closedicon'];
        if (closedIconClass) {
            dom.removeClasses(iconDiv, closedIconClass);
        }
        const className = this.cssConfig_['openicon'];
        if (className) {
            dom.addClass(iconDiv, className);
        }
    }
    /**
     * Adds appropriate classes to display a closed icon.
     *
     * @param iconDiv The div that holds the icon.
     */
    closeIcon_(iconDiv) {
        if (!iconDiv) {
            return;
        }
        const openIconClass = this.cssConfig_['openicon'];
        if (openIconClass) {
            dom.removeClasses(iconDiv, openIconClass);
        }
        const className = this.cssConfig_['closedicon'];
        if (className) {
            dom.addClass(iconDiv, className);
        }
    }
    /**
     * Sets whether the category is visible or not.
     * For a category to be visible its parent category must also be expanded.
     *
     * @param isVisible True if category should be visible.
     */
    setVisible_(isVisible) {
        this.htmlDiv_.style.display = isVisible ? 'block' : 'none';
        this.isHidden_ = !isVisible;
        if (this.parentToolbox_.getSelectedItem() === this) {
            this.parentToolbox_.clearSelection();
        }
    }
    /** Hide the category. */
    hide() {
        this.setVisible_(false);
    }
    /**
     * Show the category. Category will only appear if its parent category is also
     * expanded.
     */
    show() {
        this.setVisible_(true);
    }
    /**
     * Whether the category is visible.
     * A category is only visible if all of its ancestors are expanded and
     * isHidden_ is false.
     *
     * @returns True if the category is visible, false otherwise.
     */
    isVisible() {
        return !this.isHidden_ && this.allAncestorsExpanded_();
    }
    /**
     * Whether all ancestors of a category (parent and parent's parent, etc.) are
     * expanded.
     *
     * @returns True only if every ancestor is expanded
     */
    allAncestorsExpanded_() {
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        let category = this;
        while (category.getParent()) {
            category = category.getParent();
            if (!category.isExpanded()) {
                return false;
            }
        }
        return true;
    }
    isSelectable() {
        return this.isVisible() && !this.isDisabled_;
    }
    /**
     * Handles when the toolbox item is clicked.
     *
     * @param _e Click event to handle.
     */
    onClick(_e) { }
    // No-op
    /**
     * Sets the current category as selected.
     *
     * @param isSelected True if this category is selected, false otherwise.
     */
    setSelected(isSelected) {
        if (!this.rowDiv_) {
            return;
        }
        const className = this.cssConfig_['selected'];
        if (isSelected) {
            const defaultColour = this.parseColour_(ToolboxCategory.defaultBackgroundColour);
            this.rowDiv_.style.backgroundColor = this.colour_ || defaultColour;
            if (className) {
                dom.addClass(this.rowDiv_, className);
            }
        }
        else {
            this.rowDiv_.style.backgroundColor = '';
            if (className) {
                dom.removeClass(this.rowDiv_, className);
            }
        }
        aria.setState(this.htmlDiv_, aria.State.SELECTED, isSelected);
    }
    /**
     * Sets whether the category is disabled.
     *
     * @param isDisabled True to disable the category, false otherwise.
     */
    setDisabled(isDisabled) {
        this.isDisabled_ = isDisabled;
        this.getDiv().setAttribute('disabled', `${isDisabled}`);
        isDisabled ? this.getDiv().setAttribute('disabled', 'true') :
            this.getDiv().removeAttribute('disabled');
    }
    /**
     * Gets the name of the category. Used for emitting events.
     *
     * @returns The name of the toolbox item.
     */
    getName() {
        return this.name_;
    }
    getParent() {
        return this.parent_;
    }
    getDiv() {
        return this.htmlDiv_;
    }
    /**
     * Gets the contents of the category. These are items that are meant to be
     * displayed in the flyout.
     *
     * @returns The definition of items to be displayed in the flyout.
     */
    getContents() {
        return this.flyoutItems_;
    }
    /**
     * Updates the contents to be displayed in the flyout.
     * If the flyout is open when the contents are updated, refreshSelection on
     * the toolbox must also be called.
     *
     * @param contents The contents to be displayed in the flyout. A string can be
     *     supplied to create a dynamic category.
     */
    updateFlyoutContents(contents) {
        this.flyoutItems_ = [];
        if (typeof contents === 'string') {
            const newDefinition = {
                kind: this.toolboxItemDef_.kind,
                custom: contents,
                id: this.toolboxItemDef_.id,
                categorystyle: this.toolboxItemDef_.categorystyle,
                colour: this.toolboxItemDef_.colour,
                cssconfig: this.toolboxItemDef_.cssconfig,
                hidden: this.toolboxItemDef_.hidden,
            };
            this.toolboxItemDef_ = newDefinition;
        }
        else {
            const newDefinition = {
                kind: this.toolboxItemDef_.kind,
                name: 'name' in this.toolboxItemDef_ ? this.toolboxItemDef_['name'] :
                    '',
                contents: toolbox.convertFlyoutDefToJsonArray(contents),
                id: this.toolboxItemDef_.id,
                categorystyle: this.toolboxItemDef_.categorystyle,
                colour: this.toolboxItemDef_.colour,
                cssconfig: this.toolboxItemDef_.cssconfig,
                hidden: this.toolboxItemDef_.hidden,
            };
            this.toolboxItemDef_ = newDefinition;
        }
        this.parseContents_(this.toolboxItemDef_);
    }
    dispose() {
        dom.removeNode(this.htmlDiv_);
    }
}
/** Name used for registering a toolbox category. */
ToolboxCategory.registrationName = 'category';
/** The number of pixels to move the category over at each nested level. */
ToolboxCategory.nestedPadding = 19;
/** The width in pixels of the strip of colour next to each category. */
ToolboxCategory.borderWidth = 8;
/**
 * The default colour of the category. This is used as the background colour
 * of the category when it is selected.
 */
ToolboxCategory.defaultBackgroundColour = '#57e';
export { ToolboxCategory };
/** CSS for Toolbox.  See css.js for use. */
Css.register(`
.blocklyTreeRow:not(.blocklyTreeSelected):hover {
  background-color: rgba(255, 255, 255, .2);
}

.blocklyToolboxDiv[layout="h"] .blocklyToolboxCategory {
  margin: 1px 5px 1px 0;
}

.blocklyToolboxDiv[dir="RTL"][layout="h"] .blocklyToolboxCategory {
  margin: 1px 0 1px 5px;
}

.blocklyTreeRow {
  height: 22px;
  line-height: 22px;
  margin-bottom: 3px;
  padding-right: 8px;
  white-space: nowrap;
}

.blocklyToolboxDiv[dir="RTL"] .blocklyTreeRow {
  margin-left: 8px;
  padding-right: 0;
}

.blocklyTreeIcon {
  background-image: url(<<<PATH>>>/sprites.png);
  height: 16px;
  vertical-align: middle;
  visibility: hidden;
  width: 16px;
}

.blocklyTreeIconClosed {
  background-position: -32px -1px;
}

.blocklyToolboxDiv[dir="RTL"] .blocklyTreeIconClosed {
  background-position: 0 -1px;
}

.blocklyTreeSelected>.blocklyTreeIconClosed {
  background-position: -32px -17px;
}

.blocklyToolboxDiv[dir="RTL"] .blocklyTreeSelected>.blocklyTreeIconClosed {
  background-position: 0 -17px;
}

.blocklyTreeIconOpen {
  background-position: -16px -1px;
}

.blocklyTreeSelected>.blocklyTreeIconOpen {
  background-position: -16px -17px;
}

.blocklyTreeLabel {
  cursor: default;
  font: 16px sans-serif;
  padding: 0 3px;
  vertical-align: middle;
}

.blocklyToolboxDelete .blocklyTreeLabel {
  cursor: url("<<<PATH>>>/handdelete.cur"), auto;
}

.blocklyTreeSelected .blocklyTreeLabel {
  color: #fff;
}
`);
registry.register(registry.Type.TOOLBOX_ITEM, ToolboxCategory.registrationName, ToolboxCategory);
//# sourceMappingURL=category.js.map