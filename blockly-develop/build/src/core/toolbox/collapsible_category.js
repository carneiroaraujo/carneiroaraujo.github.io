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
goog.declareModuleId('Blockly.CollapsibleToolboxCategory');
import * as registry from '../registry.js';
import * as aria from '../utils/aria.js';
import * as dom from '../utils/dom.js';
import * as toolbox from '../utils/toolbox.js';
import { ToolboxCategory } from './category.js';
import { ToolboxSeparator } from './separator.js';
/**
 * Class for a category in a toolbox that can be collapsed.
 */
class CollapsibleToolboxCategory extends ToolboxCategory {
    /**
     * @param categoryDef The information needed to create a category in the
     *     toolbox.
     * @param toolbox The parent toolbox for the category.
     * @param opt_parent The parent category or null if the category does not have
     *     a parent.
     */
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent);
        /** Container for any child categories. */
        this.subcategoriesDiv_ = null;
        /** Whether or not the category should display its subcategories. */
        this.expanded_ = false;
        /** The child toolbox items for this category. */
        this.toolboxItems_ = [];
    }
    makeDefaultCssConfig_() {
        const cssConfig = super.makeDefaultCssConfig_();
        cssConfig['contents'] = 'blocklyToolboxContents';
        return cssConfig;
    }
    parseContents_(categoryDef) {
        if ('custom' in categoryDef) {
            this.flyoutItems_ = categoryDef['custom'];
        }
        else {
            const contents = categoryDef['contents'];
            if (!contents)
                return;
            this.flyoutItems_ = [];
            let prevIsFlyoutItem = true;
            for (let i = 0; i < contents.length; i++) {
                const itemDef = contents[i];
                // Separators can exist as either a flyout item or a toolbox item so
                // decide where it goes based on the type of the previous item.
                if (!registry.hasItem(registry.Type.TOOLBOX_ITEM, itemDef['kind']) ||
                    itemDef['kind'].toLowerCase() ===
                        ToolboxSeparator.registrationName &&
                        prevIsFlyoutItem) {
                    const flyoutItem = itemDef;
                    this.flyoutItems_.push(flyoutItem);
                    prevIsFlyoutItem = true;
                }
                else {
                    this.createToolboxItem_(itemDef);
                    prevIsFlyoutItem = false;
                }
            }
        }
    }
    /**
     * Creates a toolbox item and adds it to the list of toolbox items.
     *
     * @param itemDef The information needed to create a toolbox item.
     */
    createToolboxItem_(itemDef) {
        let registryName = itemDef['kind'];
        const categoryDef = itemDef;
        // Categories that are collapsible are created using a class registered
        // under a different name.
        if (registryName.toUpperCase() === 'CATEGORY' &&
            toolbox.isCategoryCollapsible(categoryDef)) {
            registryName = CollapsibleToolboxCategory.registrationName;
        }
        const ToolboxItemClass = registry.getClass(registry.Type.TOOLBOX_ITEM, registryName);
        const toolboxItem = new ToolboxItemClass(itemDef, this.parentToolbox_, this);
        this.toolboxItems_.push(toolboxItem);
    }
    init() {
        super.init();
        this.setExpanded(this.toolboxItemDef_['expanded'] === 'true' ||
            this.toolboxItemDef_['expanded'] === true);
    }
    createDom_() {
        super.createDom_();
        const subCategories = this.getChildToolboxItems();
        this.subcategoriesDiv_ = this.createSubCategoriesDom_(subCategories);
        aria.setRole(this.subcategoriesDiv_, aria.Role.GROUP);
        this.htmlDiv_.appendChild(this.subcategoriesDiv_);
        this.closeIcon_(this.iconDom_);
        aria.setState(this.htmlDiv_, aria.State.EXPANDED, false);
        return this.htmlDiv_;
    }
    createIconDom_() {
        const toolboxIcon = document.createElement('span');
        if (!this.parentToolbox_.isHorizontal()) {
            const className = this.cssConfig_['icon'];
            if (className) {
                dom.addClass(toolboxIcon, className);
            }
            toolboxIcon.style.visibility = 'visible';
        }
        toolboxIcon.style.display = 'inline-block';
        return toolboxIcon;
    }
    /**
     * Create the DOM for all subcategories.
     *
     * @param subcategories The subcategories.
     * @returns The div holding all the subcategories.
     */
    createSubCategoriesDom_(subcategories) {
        const contentsContainer = document.createElement('div');
        contentsContainer.style.display = 'none';
        const className = this.cssConfig_['contents'];
        if (className) {
            dom.addClass(contentsContainer, className);
        }
        for (let i = 0; i < subcategories.length; i++) {
            const newCategory = subcategories[i];
            newCategory.init();
            const newCategoryDiv = newCategory.getDiv();
            contentsContainer.appendChild(newCategoryDiv);
            if (newCategory.getClickTarget) {
                newCategory.getClickTarget()?.setAttribute('id', newCategory.getId());
            }
        }
        return contentsContainer;
    }
    /**
     * Opens or closes the current category.
     *
     * @param isExpanded True to expand the category, false to close.
     */
    setExpanded(isExpanded) {
        if (this.expanded_ === isExpanded)
            return;
        this.expanded_ = isExpanded;
        if (isExpanded) {
            this.subcategoriesDiv_.style.display = 'block';
            this.openIcon_(this.iconDom_);
        }
        else {
            this.subcategoriesDiv_.style.display = 'none';
            this.closeIcon_(this.iconDom_);
        }
        aria.setState(this.htmlDiv_, aria.State.EXPANDED, isExpanded);
        this.parentToolbox_.handleToolboxItemResize();
    }
    setVisible_(isVisible) {
        this.htmlDiv_.style.display = isVisible ? 'block' : 'none';
        const childToolboxItems = this.getChildToolboxItems();
        for (let i = 0; i < childToolboxItems.length; i++) {
            const child = childToolboxItems[i];
            child.setVisible_(isVisible);
        }
        this.isHidden_ = !isVisible;
        if (this.parentToolbox_.getSelectedItem() === this) {
            this.parentToolbox_.clearSelection();
        }
    }
    /**
     * Whether the category is expanded to show its child subcategories.
     *
     * @returns True if the toolbox item shows its children, false if it is
     *     collapsed.
     */
    isExpanded() {
        return this.expanded_;
    }
    isCollapsible() {
        return true;
    }
    onClick(_e) {
        this.toggleExpanded();
    }
    /** Toggles whether or not the category is expanded. */
    toggleExpanded() {
        this.setExpanded(!this.expanded_);
    }
    getDiv() {
        return this.htmlDiv_;
    }
    /**
     * Gets any children toolbox items. (ex. Gets the subcategories)
     *
     * @returns The child toolbox items.
     */
    getChildToolboxItems() {
        return this.toolboxItems_;
    }
}
/** Name used for registering a collapsible toolbox category. */
CollapsibleToolboxCategory.registrationName = 'collapsibleCategory';
export { CollapsibleToolboxCategory };
registry.register(registry.Type.TOOLBOX_ITEM, CollapsibleToolboxCategory.registrationName, CollapsibleToolboxCategory);
//# sourceMappingURL=collapsible_category.js.map