/**
 * @license
 * Copyright 2011 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Flyout tray containing blocks which may be created.
 *
 * @class
 */
import * as goog from '../closure/goog/goog.js';
goog.declareModuleId('Blockly.Flyout');
import * as browserEvents from './browser_events.js';
import * as common from './common.js';
import { ComponentManager } from './component_manager.js';
import { DeleteArea } from './delete_area.js';
import * as eventUtils from './events/utils.js';
import { FlyoutButton } from './flyout_button.js';
import { FlyoutMetricsManager } from './flyout_metrics_manager.js';
import { ScrollbarPair } from './scrollbar_pair.js';
import * as blocks from './serialization/blocks.js';
import * as Tooltip from './tooltip.js';
import { Coordinate } from './utils/coordinate.js';
import * as dom from './utils/dom.js';
import * as idGenerator from './utils/idgenerator.js';
import { Svg } from './utils/svg.js';
import * as toolbox from './utils/toolbox.js';
import * as Variables from './variables.js';
import { WorkspaceSvg } from './workspace_svg.js';
import * as utilsXml from './utils/xml.js';
import * as Xml from './xml.js';
var FlyoutItemType;
(function (FlyoutItemType) {
    FlyoutItemType["BLOCK"] = "block";
    FlyoutItemType["BUTTON"] = "button";
})(FlyoutItemType || (FlyoutItemType = {}));
/**
 * Class for a flyout.
 */
class Flyout extends DeleteArea {
    /**
     * @param workspaceOptions Dictionary of options for the
     *     workspace.
     */
    constructor(workspaceOptions) {
        super();
        /**
         * Whether the flyout should be laid out horizontally or not.
         *
         * @internal
         */
        this.horizontalLayout = false;
        /**
         * Array holding info needed to unbind events.
         * Used for disposing.
         * Ex: [[node, name, func], [node, name, func]].
         */
        this.boundEvents = [];
        /**
         * Function that will be registered as a change listener on the workspace
         * to reflow when blocks in the flyout workspace change.
         */
        this.reflowWrapper = null;
        /**
         * Function that disables blocks in the flyout based on max block counts
         * allowed in the target workspace. Registered as a change listener on the
         * target workspace.
         */
        this.filterWrapper = null;
        /**
         * List of background mats that lurk behind each block to catch clicks
         * landing in the blocks' lakes and bays.
         */
        this.mats = [];
        /**
         * List of visible buttons.
         */
        this.buttons_ = [];
        /**
         * List of event listeners.
         */
        this.listeners = [];
        /**
         * List of blocks that should always be disabled.
         */
        this.permanentlyDisabled = [];
        /**
         * A list of blocks that can be reused.
         */
        this.recycledBlocks = [];
        /**
         * Does the flyout automatically close when a block is created?
         */
        this.autoClose = true;
        /**
         * Whether the flyout is visible.
         */
        this.isVisible_ = false;
        /**
         * Whether the workspace containing this flyout is visible.
         */
        this.containerVisible = true;
        /**
         * Corner radius of the flyout background.
         */
        this.CORNER_RADIUS = 8;
        /**
         * Top/bottom padding between scrollbar and edge of flyout background.
         */
        this.SCROLLBAR_MARGIN = 2.5;
        /**
         * Width of flyout.
         */
        this.width_ = 0;
        /**
         * Height of flyout.
         */
        this.height_ = 0;
        // clang-format off
        /**
         * Range of a drag angle from a flyout considered "dragging toward
         * workspace". Drags that are within the bounds of this many degrees from
         * the orthogonal line to the flyout edge are considered to be "drags toward
         * the workspace".
         *
         * @example
         *
         * ```
         * Flyout                                                 Edge   Workspace
         * [block] /  <-within this angle, drags "toward workspace" |
         * [block] ---- orthogonal to flyout boundary ----          |
         * [block] \                                                |
         * ```
         *
         * The angle is given in degrees from the orthogonal.
         *
         * This is used to know when to create a new block and when to scroll the
         * flyout. Setting it to 360 means that all drags create a new block.
         */
        // clang-format on
        this.dragAngleRange_ = 70;
        /**
         * The path around the background of the flyout, which will be filled with a
         * background colour.
         */
        this.svgBackground_ = null;
        /**
         * The root SVG group for the button or label.
         */
        this.svgGroup_ = null;
        workspaceOptions.setMetrics = this.setMetrics_.bind(this);
        this.workspace_ = new WorkspaceSvg(workspaceOptions);
        this.workspace_.setMetricsManager(new FlyoutMetricsManager(this.workspace_, this));
        this.workspace_.internalIsFlyout = true;
        // Keep the workspace visibility consistent with the flyout's visibility.
        this.workspace_.setVisible(this.isVisible_);
        /**
         * The unique id for this component that is used to register with the
         * ComponentManager.
         */
        this.id = idGenerator.genUid();
        /**
         * Is RTL vs LTR.
         */
        this.RTL = !!workspaceOptions.RTL;
        /**
         * Position of the toolbox and flyout relative to the workspace.
         */
        this.toolboxPosition_ = workspaceOptions.toolboxPosition;
        /**
         * Width of output tab.
         */
        this.tabWidth_ = this.workspace_.getRenderer().getConstants().TAB_WIDTH;
        /**
         * A map from blocks to the rects which are beneath them to act as input
         * targets.
         *
         * @internal
         */
        this.rectMap_ = new WeakMap();
        /**
         * Margin around the edges of the blocks in the flyout.
         */
        this.MARGIN = this.CORNER_RADIUS;
        // TODO: Move GAP_X and GAP_Y to their appropriate files.
        /**
         * Gap between items in horizontal flyouts. Can be overridden with the "sep"
         * element.
         */
        this.GAP_X = this.MARGIN * 3;
        /**
         * Gap between items in vertical flyouts. Can be overridden with the "sep"
         * element.
         */
        this.GAP_Y = this.MARGIN * 3;
    }
    /**
     * Creates the flyout's DOM.  Only needs to be called once.  The flyout can
     * either exist as its own SVG element or be a g element nested inside a
     * separate SVG element.
     *
     * @param tagName The type of tag to
     *     put the flyout in. This should be <svg> or <g>.
     * @returns The flyout's SVG group.
     */
    createDom(tagName) {
        /*
            <svg | g>
              <path class="blocklyFlyoutBackground"/>
              <g class="blocklyFlyout"></g>
            </ svg | g>
            */
        // Setting style to display:none to start. The toolbox and flyout
        // hide/show code will set up proper visibility and size later.
        this.svgGroup_ = dom.createSvgElement(tagName, { 'class': 'blocklyFlyout', 'style': 'display: none' });
        this.svgBackground_ = dom.createSvgElement(Svg.PATH, { 'class': 'blocklyFlyoutBackground' }, this.svgGroup_);
        this.svgGroup_.appendChild(this.workspace_.createDom());
        this.workspace_.getThemeManager().subscribe(this.svgBackground_, 'flyoutBackgroundColour', 'fill');
        this.workspace_.getThemeManager().subscribe(this.svgBackground_, 'flyoutOpacity', 'fill-opacity');
        return this.svgGroup_;
    }
    /**
     * Initializes the flyout.
     *
     * @param targetWorkspace The workspace in which to
     *     create new blocks.
     */
    init(targetWorkspace) {
        this.targetWorkspace = targetWorkspace;
        this.workspace_.targetWorkspace = targetWorkspace;
        this.workspace_.scrollbar = new ScrollbarPair(this.workspace_, this.horizontalLayout, !this.horizontalLayout, 'blocklyFlyoutScrollbar', this.SCROLLBAR_MARGIN);
        this.hide();
        this.boundEvents.push(browserEvents.conditionalBind(this.svgGroup_, 'wheel', this, this.wheel_));
        if (!this.autoClose) {
            this.filterWrapper = this.filterForCapacity.bind(this);
            this.targetWorkspace.addChangeListener(this.filterWrapper);
        }
        // Dragging the flyout up and down.
        this.boundEvents.push(browserEvents.conditionalBind(this.svgBackground_, 'pointerdown', this, this.onMouseDown));
        // A flyout connected to a workspace doesn't have its own current gesture.
        this.workspace_.getGesture =
            this.targetWorkspace.getGesture.bind(this.targetWorkspace);
        // Get variables from the main workspace rather than the target workspace.
        this.workspace_.setVariableMap(this.targetWorkspace.getVariableMap());
        this.workspace_.createPotentialVariableMap();
        targetWorkspace.getComponentManager().addComponent({
            component: this,
            weight: 1,
            capabilities: [
                ComponentManager.Capability.DELETE_AREA,
                ComponentManager.Capability.DRAG_TARGET,
            ],
        });
    }
    /**
     * Dispose of this flyout.
     * Unlink from all DOM elements to prevent memory leaks.
     *
     * @suppress {checkTypes}
     */
    dispose() {
        this.hide();
        this.workspace_.getComponentManager().removeComponent(this.id);
        for (const event of this.boundEvents) {
            browserEvents.unbind(event);
        }
        this.boundEvents.length = 0;
        if (this.filterWrapper) {
            this.targetWorkspace.removeChangeListener(this.filterWrapper);
        }
        if (this.workspace_) {
            this.workspace_.getThemeManager().unsubscribe(this.svgBackground_);
            this.workspace_.dispose();
        }
        if (this.svgGroup_) {
            dom.removeNode(this.svgGroup_);
        }
    }
    /**
     * Get the width of the flyout.
     *
     * @returns The width of the flyout.
     */
    getWidth() {
        return this.width_;
    }
    /**
     * Get the height of the flyout.
     *
     * @returns The width of the flyout.
     */
    getHeight() {
        return this.height_;
    }
    /**
     * Get the scale (zoom level) of the flyout. By default,
     * this matches the target workspace scale, but this can be overridden.
     *
     * @returns Flyout workspace scale.
     */
    getFlyoutScale() {
        return this.targetWorkspace.scale;
    }
    /**
     * Get the workspace inside the flyout.
     *
     * @returns The workspace inside the flyout.
     */
    getWorkspace() {
        return this.workspace_;
    }
    /**
     * Is the flyout visible?
     *
     * @returns True if visible.
     */
    isVisible() {
        return this.isVisible_;
    }
    /**
     * Set whether the flyout is visible. A value of true does not necessarily
     * mean that the flyout is shown. It could be hidden because its container is
     * hidden.
     *
     * @param visible True if visible.
     */
    setVisible(visible) {
        const visibilityChanged = visible !== this.isVisible();
        this.isVisible_ = visible;
        if (visibilityChanged) {
            if (!this.autoClose) {
                // Auto-close flyouts are ignored as drag targets, so only non
                // auto-close flyouts need to have their drag target updated.
                this.workspace_.recordDragTargets();
            }
            this.updateDisplay();
        }
    }
    /**
     * Set whether this flyout's container is visible.
     *
     * @param visible Whether the container is visible.
     */
    setContainerVisible(visible) {
        const visibilityChanged = visible !== this.containerVisible;
        this.containerVisible = visible;
        if (visibilityChanged) {
            this.updateDisplay();
        }
    }
    /**
     * Update the display property of the flyout based whether it thinks it should
     * be visible and whether its containing workspace is visible.
     */
    updateDisplay() {
        let show = true;
        if (!this.containerVisible) {
            show = false;
        }
        else {
            show = this.isVisible();
        }
        if (this.svgGroup_) {
            this.svgGroup_.style.display = show ? 'block' : 'none';
        }
        // Update the scrollbar's visibility too since it should mimic the
        // flyout's visibility.
        this.workspace_.scrollbar?.setContainerVisible(show);
    }
    /**
     * Update the view based on coordinates calculated in position().
     *
     * @param width The computed width of the flyout's SVG group
     * @param height The computed height of the flyout's SVG group.
     * @param x The computed x origin of the flyout's SVG group.
     * @param y The computed y origin of the flyout's SVG group.
     */
    positionAt_(width, height, x, y) {
        this.svgGroup_?.setAttribute('width', `${width}`);
        this.svgGroup_?.setAttribute('height', `${height}`);
        this.workspace_.setCachedParentSvgSize(width, height);
        if (this.svgGroup_) {
            const transform = 'translate(' + x + 'px,' + y + 'px)';
            dom.setCssTransform(this.svgGroup_, transform);
        }
        // Update the scrollbar (if one exists).
        const scrollbar = this.workspace_.scrollbar;
        if (scrollbar) {
            // Set the scrollbars origin to be the top left of the flyout.
            scrollbar.setOrigin(x, y);
            scrollbar.resize();
            // If origin changed and metrics haven't changed enough to trigger
            // reposition in resize, we need to call setPosition. See issue #4692.
            if (scrollbar.hScroll) {
                scrollbar.hScroll.setPosition(scrollbar.hScroll.position.x, scrollbar.hScroll.position.y);
            }
            if (scrollbar.vScroll) {
                scrollbar.vScroll.setPosition(scrollbar.vScroll.position.x, scrollbar.vScroll.position.y);
            }
        }
    }
    /**
     * Hide and empty the flyout.
     */
    hide() {
        if (!this.isVisible()) {
            return;
        }
        this.setVisible(false);
        // Delete all the event listeners.
        for (const listen of this.listeners) {
            browserEvents.unbind(listen);
        }
        this.listeners.length = 0;
        if (this.reflowWrapper) {
            this.workspace_.removeChangeListener(this.reflowWrapper);
            this.reflowWrapper = null;
        }
        // Do NOT delete the blocks here.  Wait until Flyout.show.
        // https://neil.fraser.name/news/2014/08/09/
    }
    /**
     * Show and populate the flyout.
     *
     * @param flyoutDef Contents to display
     *     in the flyout. This is either an array of Nodes, a NodeList, a
     *     toolbox definition, or a string with the name of the dynamic category.
     */
    show(flyoutDef) {
        this.workspace_.setResizesEnabled(false);
        this.hide();
        this.clearOldBlocks();
        // Handle dynamic categories, represented by a name instead of a list.
        if (typeof flyoutDef === 'string') {
            flyoutDef = this.getDynamicCategoryContents(flyoutDef);
        }
        this.setVisible(true);
        // Parse the Array, Node or NodeList into a a list of flyout items.
        const parsedContent = toolbox.convertFlyoutDefToJsonArray(flyoutDef);
        const flyoutInfo = this.createFlyoutInfo(parsedContent);
        this.layout_(flyoutInfo.contents, flyoutInfo.gaps);
        if (this.horizontalLayout) {
            this.height_ = 0;
        }
        else {
            this.width_ = 0;
        }
        this.workspace_.setResizesEnabled(true);
        this.reflow();
        this.filterForCapacity();
        // Correctly position the flyout's scrollbar when it opens.
        this.position();
        this.reflowWrapper = this.reflow.bind(this);
        this.workspace_.addChangeListener(this.reflowWrapper);
        this.emptyRecycledBlocks();
    }
    /**
     * Create the contents array and gaps array necessary to create the layout for
     * the flyout.
     *
     * @param parsedContent The array
     *     of objects to show in the flyout.
     * @returns The list of contents and gaps needed to lay out the flyout.
     */
    createFlyoutInfo(parsedContent) {
        const contents = [];
        const gaps = [];
        this.permanentlyDisabled.length = 0;
        const defaultGap = this.horizontalLayout ? this.GAP_X : this.GAP_Y;
        for (const info of parsedContent) {
            if ('custom' in info) {
                const customInfo = info;
                const categoryName = customInfo['custom'];
                const flyoutDef = this.getDynamicCategoryContents(categoryName);
                const parsedDynamicContent = toolbox.convertFlyoutDefToJsonArray(flyoutDef);
                const { contents: dynamicContents, gaps: dynamicGaps } = this.createFlyoutInfo(parsedDynamicContent);
                contents.push(...dynamicContents);
                gaps.push(...dynamicGaps);
            }
            switch (info['kind'].toUpperCase()) {
                case 'BLOCK': {
                    const blockInfo = info;
                    const block = this.createFlyoutBlock(blockInfo);
                    contents.push({ type: FlyoutItemType.BLOCK, block: block });
                    this.addBlockGap(blockInfo, gaps, defaultGap);
                    break;
                }
                case 'SEP': {
                    const sepInfo = info;
                    this.addSeparatorGap(sepInfo, gaps, defaultGap);
                    break;
                }
                case 'LABEL': {
                    const labelInfo = info;
                    // A label is a button with different styling.
                    const label = this.createButton(labelInfo, /** isLabel */ true);
                    contents.push({ type: FlyoutItemType.BUTTON, button: label });
                    gaps.push(defaultGap);
                    break;
                }
                case 'BUTTON': {
                    const buttonInfo = info;
                    const button = this.createButton(buttonInfo, /** isLabel */ false);
                    contents.push({ type: FlyoutItemType.BUTTON, button: button });
                    gaps.push(defaultGap);
                    break;
                }
            }
        }
        return { contents: contents, gaps: gaps };
    }
    /**
     * Gets the flyout definition for the dynamic category.
     *
     * @param categoryName The name of the dynamic category.
     * @returns The definition of the
     *     flyout in one of its many forms.
     */
    getDynamicCategoryContents(categoryName) {
        // Look up the correct category generation function and call that to get a
        // valid XML list.
        const fnToApply = this.workspace_.targetWorkspace.getToolboxCategoryCallback(categoryName);
        if (typeof fnToApply !== 'function') {
            throw TypeError('Couldn\'t find a callback function when opening' +
                ' a toolbox category.');
        }
        return fnToApply(this.workspace_.targetWorkspace);
    }
    /**
     * Creates a flyout button or a flyout label.
     *
     * @param btnInfo The object holding information about a button or a label.
     * @param isLabel True if the button is a label, false otherwise.
     * @returns The object used to display the button in the
     *    flyout.
     */
    createButton(btnInfo, isLabel) {
        const curButton = new FlyoutButton(this.workspace_, this.targetWorkspace, btnInfo, isLabel);
        return curButton;
    }
    /**
     * Create a block from the xml and permanently disable any blocks that were
     * defined as disabled.
     *
     * @param blockInfo The info of the block.
     * @returns The block created from the blockInfo.
     */
    createFlyoutBlock(blockInfo) {
        let block;
        if (blockInfo['blockxml']) {
            const xml = (typeof blockInfo['blockxml'] === 'string' ?
                utilsXml.textToDom(blockInfo['blockxml']) :
                blockInfo['blockxml']);
            block = this.getRecycledBlock(xml.getAttribute('type'));
            if (!block) {
                block = Xml.domToBlock(xml, this.workspace_);
            }
        }
        else {
            block = this.getRecycledBlock(blockInfo['type']);
            if (!block) {
                if (blockInfo['enabled'] === undefined) {
                    blockInfo['enabled'] = blockInfo['disabled'] !== 'true' &&
                        blockInfo['disabled'] !== true;
                }
                block = blocks.append(blockInfo, this.workspace_);
            }
        }
        if (!block.isEnabled()) {
            // Record blocks that were initially disabled.
            // Do not enable these blocks as a result of capacity filtering.
            this.permanentlyDisabled.push(block);
        }
        return block;
    }
    /**
     * Returns a block from the array of recycled blocks with the given type, or
     * undefined if one cannot be found.
     *
     * @param blockType The type of the block to try to recycle.
     * @returns The recycled block, or undefined if
     *     one could not be recycled.
     */
    getRecycledBlock(blockType) {
        let index = -1;
        for (let i = 0; i < this.recycledBlocks.length; i++) {
            if (this.recycledBlocks[i].type === blockType) {
                index = i;
                break;
            }
        }
        return index === -1 ? undefined : this.recycledBlocks.splice(index, 1)[0];
    }
    /**
     * Adds a gap in the flyout based on block info.
     *
     * @param blockInfo Information about a block.
     * @param gaps The list of gaps between items in the flyout.
     * @param defaultGap The default gap between one element and the
     *     next.
     */
    addBlockGap(blockInfo, gaps, defaultGap) {
        let gap;
        if (blockInfo['gap']) {
            gap = parseInt(String(blockInfo['gap']));
        }
        else if (blockInfo['blockxml']) {
            const xml = (typeof blockInfo['blockxml'] === 'string' ?
                utilsXml.textToDom(blockInfo['blockxml']) :
                blockInfo['blockxml']);
            gap = parseInt(xml.getAttribute('gap'));
        }
        gaps.push(!gap || isNaN(gap) ? defaultGap : gap);
    }
    /**
     * Add the necessary gap in the flyout for a separator.
     *
     * @param sepInfo The object holding
     *    information about a separator.
     * @param gaps The list gaps between items in the flyout.
     * @param defaultGap The default gap between the button and next
     *     element.
     */
    addSeparatorGap(sepInfo, gaps, defaultGap) {
        // Change the gap between two toolbox elements.
        // <sep gap="36"></sep>
        // The default gap is 24, can be set larger or smaller.
        // This overwrites the gap attribute on the previous element.
        const newGap = parseInt(String(sepInfo['gap']));
        // Ignore gaps before the first block.
        if (!isNaN(newGap) && gaps.length > 0) {
            gaps[gaps.length - 1] = newGap;
        }
        else {
            gaps.push(defaultGap);
        }
    }
    /**
     * Delete blocks, mats and buttons from a previous showing of the flyout.
     */
    clearOldBlocks() {
        // Delete any blocks from a previous showing.
        const oldBlocks = this.workspace_.getTopBlocks(false);
        for (let i = 0, block; block = oldBlocks[i]; i++) {
            if (this.blockIsRecyclable_(block)) {
                this.recycleBlock(block);
            }
            else {
                block.dispose(false, false);
            }
        }
        // Delete any mats from a previous showing.
        for (let j = 0; j < this.mats.length; j++) {
            const rect = this.mats[j];
            if (rect) {
                Tooltip.unbindMouseEvents(rect);
                dom.removeNode(rect);
            }
        }
        this.mats.length = 0;
        // Delete any buttons from a previous showing.
        for (let i = 0, button; button = this.buttons_[i]; i++) {
            button.dispose();
        }
        this.buttons_.length = 0;
        // Clear potential variables from the previous showing.
        this.workspace_.getPotentialVariableMap()?.clear();
    }
    /**
     * Empties all of the recycled blocks, properly disposing of them.
     */
    emptyRecycledBlocks() {
        for (let i = 0; i < this.recycledBlocks.length; i++) {
            this.recycledBlocks[i].dispose();
        }
        this.recycledBlocks = [];
    }
    /**
     * Returns whether the given block can be recycled or not.
     *
     * @param _block The block to check for recyclability.
     * @returns True if the block can be recycled. False otherwise.
     */
    blockIsRecyclable_(_block) {
        // By default, recycling is disabled.
        return false;
    }
    /**
     * Puts a previously created block into the recycle bin and moves it to the
     * top of the workspace. Used during large workspace swaps to limit the number
     * of new DOM elements we need to create.
     *
     * @param block The block to recycle.
     */
    recycleBlock(block) {
        const xy = block.getRelativeToSurfaceXY();
        block.moveBy(-xy.x, -xy.y);
        this.recycledBlocks.push(block);
    }
    /**
     * Add listeners to a block that has been added to the flyout.
     *
     * @param root The root node of the SVG group the block is in.
     * @param block The block to add listeners for.
     * @param rect The invisible rectangle under the block that acts
     *     as a mat for that block.
     */
    addBlockListeners_(root, block, rect) {
        this.listeners.push(browserEvents.conditionalBind(root, 'pointerdown', null, this.blockMouseDown(block)));
        this.listeners.push(browserEvents.conditionalBind(rect, 'pointerdown', null, this.blockMouseDown(block)));
        this.listeners.push(browserEvents.bind(root, 'pointerenter', block, block.addSelect));
        this.listeners.push(browserEvents.bind(root, 'pointerleave', block, block.removeSelect));
        this.listeners.push(browserEvents.bind(rect, 'pointerenter', block, block.addSelect));
        this.listeners.push(browserEvents.bind(rect, 'pointerleave', block, block.removeSelect));
    }
    /**
     * Handle a pointerdown on an SVG block in a non-closing flyout.
     *
     * @param block The flyout block to copy.
     * @returns Function to call when block is clicked.
     */
    blockMouseDown(block) {
        return (e) => {
            const gesture = this.targetWorkspace.getGesture(e);
            if (gesture) {
                gesture.setStartBlock(block);
                gesture.handleFlyoutStart(e, this);
            }
        };
    }
    /**
     * Pointer down on the flyout background.  Start a vertical scroll drag.
     *
     * @param e Pointer down event.
     */
    onMouseDown(e) {
        const gesture = this.targetWorkspace.getGesture(e);
        if (gesture) {
            gesture.handleFlyoutStart(e, this);
        }
    }
    /**
     * Does this flyout allow you to create a new instance of the given block?
     * Used for deciding if a block can be "dragged out of" the flyout.
     *
     * @param block The block to copy from the flyout.
     * @returns True if you can create a new instance of the block, false
     *    otherwise.
     * @internal
     */
    isBlockCreatable(block) {
        return block.isEnabled();
    }
    /**
     * Create a copy of this block on the workspace.
     *
     * @param originalBlock The block to copy from the flyout.
     * @returns The newly created block.
     * @throws {Error} if something went wrong with deserialization.
     * @internal
     */
    createBlock(originalBlock) {
        let newBlock = null;
        eventUtils.disable();
        const variablesBeforeCreation = this.targetWorkspace.getAllVariables();
        this.targetWorkspace.setResizesEnabled(false);
        try {
            newBlock = this.placeNewBlock(originalBlock);
        }
        finally {
            eventUtils.enable();
        }
        // Close the flyout.
        this.targetWorkspace.hideChaff();
        const newVariables = Variables.getAddedVariables(this.targetWorkspace, variablesBeforeCreation);
        if (eventUtils.isEnabled()) {
            eventUtils.setGroup(true);
            // Fire a VarCreate event for each (if any) new variable created.
            for (let i = 0; i < newVariables.length; i++) {
                const thisVariable = newVariables[i];
                eventUtils.fire(new (eventUtils.get(eventUtils.VAR_CREATE))(thisVariable));
            }
            // Block events come after var events, in case they refer to newly created
            // variables.
            eventUtils.fire(new (eventUtils.get(eventUtils.BLOCK_CREATE))(newBlock));
        }
        if (this.autoClose) {
            this.hide();
        }
        else {
            this.filterForCapacity();
        }
        return newBlock;
    }
    /**
     * Initialize the given button: move it to the correct location,
     * add listeners, etc.
     *
     * @param button The button to initialize and place.
     * @param x The x position of the cursor during this layout pass.
     * @param y The y position of the cursor during this layout pass.
     */
    initFlyoutButton_(button, x, y) {
        const buttonSvg = button.createDom();
        button.moveTo(x, y);
        button.show();
        // Clicking on a flyout button or label is a lot like clicking on the
        // flyout background.
        this.listeners.push(browserEvents.conditionalBind(buttonSvg, 'pointerdown', this, this.onMouseDown));
        this.buttons_.push(button);
    }
    /**
     * Create and place a rectangle corresponding to the given block.
     *
     * @param block The block to associate the rect to.
     * @param x The x position of the cursor during this layout pass.
     * @param y The y position of the cursor during this layout pass.
     * @param blockHW The height and width of
     *     the block.
     * @param index The index into the mats list where this rect should
     *     be placed.
     * @returns Newly created SVG element for the rectangle behind
     *     the block.
     */
    createRect_(block, x, y, blockHW, index) {
        // Create an invisible rectangle under the block to act as a button.  Just
        // using the block as a button is poor, since blocks have holes in them.
        const rect = dom.createSvgElement(Svg.RECT, {
            'fill-opacity': 0,
            'x': x,
            'y': y,
            'height': blockHW.height,
            'width': blockHW.width,
        });
        rect.tooltip = block;
        Tooltip.bindMouseEvents(rect);
        // Add the rectangles under the blocks, so that the blocks' tooltips work.
        this.workspace_.getCanvas().insertBefore(rect, block.getSvgRoot());
        this.rectMap_.set(block, rect);
        this.mats[index] = rect;
        return rect;
    }
    /**
     * Move a rectangle to sit exactly behind a block, taking into account tabs,
     * hats, and any other protrusions we invent.
     *
     * @param rect The rectangle to move directly behind the block.
     * @param block The block the rectangle should be behind.
     */
    moveRectToBlock_(rect, block) {
        const blockHW = block.getHeightWidth();
        rect.setAttribute('width', String(blockHW.width));
        rect.setAttribute('height', String(blockHW.height));
        const blockXY = block.getRelativeToSurfaceXY();
        rect.setAttribute('y', String(blockXY.y));
        rect.setAttribute('x', String(this.RTL ? blockXY.x - blockHW.width : blockXY.x));
    }
    /**
     * Filter the blocks on the flyout to disable the ones that are above the
     * capacity limit.  For instance, if the user may only place two more blocks
     * on the workspace, an "a + b" block that has two shadow blocks would be
     * disabled.
     */
    filterForCapacity() {
        const blocks = this.workspace_.getTopBlocks(false);
        for (let i = 0, block; block = blocks[i]; i++) {
            if (this.permanentlyDisabled.indexOf(block) === -1) {
                const enable = this.targetWorkspace.isCapacityAvailable(common.getBlockTypeCounts(block));
                while (block) {
                    block.setEnabled(enable);
                    block = block.getNextBlock();
                }
            }
        }
    }
    /**
     * Reflow blocks and their mats.
     */
    reflow() {
        if (this.reflowWrapper) {
            this.workspace_.removeChangeListener(this.reflowWrapper);
        }
        this.reflowInternal_();
        if (this.reflowWrapper) {
            this.workspace_.addChangeListener(this.reflowWrapper);
        }
    }
    /**
     * @returns True if this flyout may be scrolled with a scrollbar or
     *     by dragging.
     * @internal
     */
    isScrollable() {
        return this.workspace_.scrollbar ? this.workspace_.scrollbar.isVisible() :
            false;
    }
    /**
     * Copy a block from the flyout to the workspace and position it correctly.
     *
     * @param oldBlock The flyout block to copy.
     * @returns The new block in the main workspace.
     */
    placeNewBlock(oldBlock) {
        const targetWorkspace = this.targetWorkspace;
        const svgRootOld = oldBlock.getSvgRoot();
        if (!svgRootOld) {
            throw Error('oldBlock is not rendered.');
        }
        // Clone the block.
        const json = blocks.save(oldBlock);
        // Normallly this resizes leading to weird jumps. Save it for terminateDrag.
        targetWorkspace.setResizesEnabled(false);
        const block = blocks.append(json, targetWorkspace);
        this.positionNewBlock(oldBlock, block);
        return block;
    }
    /**
     * Positions a block on the target workspace.
     *
     * @param oldBlock The flyout block being copied.
     * @param block The block to posiiton.
     */
    positionNewBlock(oldBlock, block) {
        const targetWorkspace = this.targetWorkspace;
        // The offset in pixels between the main workspace's origin and the upper
        // left corner of the injection div.
        const mainOffsetPixels = targetWorkspace.getOriginOffsetInPixels();
        // The offset in pixels between the flyout workspace's origin and the upper
        // left corner of the injection div.
        const flyoutOffsetPixels = this.workspace_.getOriginOffsetInPixels();
        // The position of the old block in flyout workspace coordinates.
        const oldBlockPos = oldBlock.getRelativeToSurfaceXY();
        // The position of the old block in pixels relative to the flyout
        // workspace's origin.
        oldBlockPos.scale(this.workspace_.scale);
        // The position of the old block in pixels relative to the upper left corner
        // of the injection div.
        const oldBlockOffsetPixels = Coordinate.sum(flyoutOffsetPixels, oldBlockPos);
        // The position of the old block in pixels relative to the origin of the
        // main workspace.
        const finalOffset = Coordinate.difference(oldBlockOffsetPixels, mainOffsetPixels);
        // The position of the old block in main workspace coordinates.
        finalOffset.scale(1 / targetWorkspace.scale);
        block.moveTo(new Coordinate(finalOffset.x, finalOffset.y));
    }
}
/**
 * The type of a flyout content item.
 */
Flyout.FlyoutItemType = FlyoutItemType;
export { Flyout };
//# sourceMappingURL=flyout_base.js.map