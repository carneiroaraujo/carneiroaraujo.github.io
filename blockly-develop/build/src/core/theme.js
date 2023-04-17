/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The class representing a theme.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.Theme');
import * as registry from './registry.js';
import * as object from './utils/object.js';
/**
 * Class for a theme.
 */
export class Theme {
    /**
     * @param name Theme name.
     * @param opt_blockStyles A map from style names (strings) to objects with
     *     style attributes for blocks.
     * @param opt_categoryStyles A map from style names (strings) to objects with
     *     style attributes for categories.
     * @param opt_componentStyles A map of Blockly component names to style value.
     */
    constructor(name, opt_blockStyles, opt_categoryStyles, opt_componentStyles) {
        this.name = name;
        /**
         * Whether or not to add a 'hat' on top of all blocks with no previous or
         * output connections.
         *
         * @internal
         */
        this.startHats = false;
        /** The block styles map. */
        this.blockStyles = opt_blockStyles || Object.create(null);
        /** The category styles map. */
        this.categoryStyles = opt_categoryStyles || Object.create(null);
        /** The UI components styles map. */
        this.componentStyles =
            opt_componentStyles || Object.create(null);
        /** The font style. */
        this.fontStyle = Object.create(null);
        // Register the theme by name.
        registry.register(registry.Type.THEME, name, this);
    }
    /**
     * Gets the class name that identifies this theme.
     *
     * @returns The CSS class name.
     * @internal
     */
    getClassName() {
        return this.name + '-theme';
    }
    /**
     * Overrides or adds a style to the blockStyles map.
     *
     * @param blockStyleName The name of the block style.
     * @param blockStyle The block style.
     */
    setBlockStyle(blockStyleName, blockStyle) {
        this.blockStyles[blockStyleName] = blockStyle;
    }
    /**
     * Overrides or adds a style to the categoryStyles map.
     *
     * @param categoryStyleName The name of the category style.
     * @param categoryStyle The category style.
     */
    setCategoryStyle(categoryStyleName, categoryStyle) {
        this.categoryStyles[categoryStyleName] = categoryStyle;
    }
    /**
     * Gets the style for a given Blockly UI component.  If the style value is a
     * string, we attempt to find the value of any named references.
     *
     * @param componentName The name of the component.
     * @returns The style value.
     */
    getComponentStyle(componentName) {
        const style = this.componentStyles[componentName];
        if (!style) {
            return null;
        }
        if (typeof style === 'string') {
            const recursiveStyle = this.getComponentStyle(style);
            if (recursiveStyle) {
                return recursiveStyle;
            }
        }
        return `${style}`;
    }
    /**
     * Configure a specific Blockly UI component with a style value.
     *
     * @param componentName The name of the component.
     * @param styleValue The style value.
     */
    setComponentStyle(componentName, styleValue) {
        this.componentStyles[componentName] = styleValue;
    }
    /**
     * Configure a theme's font style.
     *
     * @param fontStyle The font style.
     */
    setFontStyle(fontStyle) {
        this.fontStyle = fontStyle;
    }
    /**
     * Configure a theme's start hats.
     *
     * @param startHats True if the theme enables start hats, false otherwise.
     */
    setStartHats(startHats) {
        this.startHats = startHats;
    }
    /**
     * Define a new Blockly theme.
     *
     * @param name The name of the theme.
     * @param themeObj An object containing theme properties.
     * @returns A new Blockly theme.
     */
    static defineTheme(name, themeObj) {
        name = name.toLowerCase();
        const theme = new Theme(name);
        let base = themeObj['base'];
        if (base) {
            if (typeof base === 'string') {
                base = registry.getObject(registry.Type.THEME, base) ?? undefined;
            }
            if (base instanceof Theme) {
                object.deepMerge(theme, base);
                theme.name = name;
            }
        }
        object.deepMerge(theme.blockStyles, themeObj['blockStyles']);
        object.deepMerge(theme.categoryStyles, themeObj['categoryStyles']);
        object.deepMerge(theme.componentStyles, themeObj['componentStyles']);
        object.deepMerge(theme.fontStyle, themeObj['fontStyle']);
        if (themeObj['startHats'] !== null) {
            theme.startHats = themeObj['startHats'];
        }
        return theme;
    }
}
//# sourceMappingURL=theme.js.map