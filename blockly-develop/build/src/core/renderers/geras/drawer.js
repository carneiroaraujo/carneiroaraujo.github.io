/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../../closure/goog/goog.js';
goog.declareModuleId('Blockly.geras.Drawer');
import * as svgPaths from '../../utils/svg_paths.js';
import * as debug from '../common/debug.js';
import { Drawer as BaseDrawer } from '../common/drawer.js';
import { Highlighter } from './highlighter.js';
/**
 * An object that draws a block based on the given rendering information,
 * customized for the geras renderer.
 */
export class Drawer extends BaseDrawer {
    /**
     * @param block The block to render.
     * @param info An object containing all information needed to render this
     *     block.
     */
    constructor(block, info) {
        super(block, info);
        // Unlike Thrasos, Geras has highlights and drop shadows.
        this.highlighter_ = new Highlighter(info);
    }
    draw() {
        this.hideHiddenIcons_();
        this.drawOutline_();
        this.drawInternals_();
        const pathObject = this.block_.pathObject;
        pathObject.setPath(this.outlinePath_ + '\n' + this.inlinePath_);
        pathObject.setHighlightPath(this.highlighter_.getPath());
        if (this.info_.RTL) {
            pathObject.flipRTL();
        }
        if (debug.isDebuggerEnabled()) {
            this.block_?.renderingDebugger?.drawDebug(this.block_, this.info_);
        }
        this.recordSizeOnBlock_();
    }
    drawTop_() {
        this.highlighter_.drawTopCorner(this.info_.topRow);
        this.highlighter_.drawRightSideRow(this.info_.topRow);
        super.drawTop_();
    }
    drawJaggedEdge_(row) {
        this.highlighter_.drawJaggedEdge_(row);
        super.drawJaggedEdge_(row);
    }
    drawValueInput_(row) {
        this.highlighter_.drawValueInput(row);
        super.drawValueInput_(row);
    }
    drawStatementInput_(row) {
        this.highlighter_.drawStatementInput(row);
        super.drawStatementInput_(row);
    }
    drawRightSideRow_(row) {
        this.highlighter_.drawRightSideRow(row);
        this.outlinePath_ += svgPaths.lineOnAxis('H', row.xPos + row.width) +
            svgPaths.lineOnAxis('V', row.yPos + row.height);
    }
    drawBottom_() {
        this.highlighter_.drawBottomRow(this.info_.bottomRow);
        super.drawBottom_();
    }
    /**
     * Add steps for the left side of the block, which may include an output
     * connection
     */
    drawLeft_() {
        this.highlighter_.drawLeft();
        super.drawLeft_();
    }
    drawInlineInput_(input) {
        this.highlighter_.drawInlineInput(input);
        super.drawInlineInput_(input);
    }
    positionInlineInputConnection_(input) {
        const yPos = input.centerline - input.height / 2;
        // Move the connection.
        if (input.connectionModel) {
            // xPos already contains info about startX
            let connX = input.xPos + input.connectionWidth + this.constants_.DARK_PATH_OFFSET;
            if (this.info_.RTL) {
                connX *= -1;
            }
            input.connectionModel.setOffsetInBlock(connX, yPos + input.connectionOffsetY + this.constants_.DARK_PATH_OFFSET);
        }
    }
    positionStatementInputConnection_(row) {
        const input = row.getLastInput();
        if (input?.connectionModel) {
            let connX = row.xPos + row.statementEdge + input.notchOffset;
            if (this.info_.RTL) {
                connX *= -1;
            }
            else {
                connX += this.constants_.DARK_PATH_OFFSET;
            }
            input.connectionModel.setOffsetInBlock(connX, row.yPos + this.constants_.DARK_PATH_OFFSET);
        }
    }
    positionExternalValueConnection_(row) {
        const input = row.getLastInput();
        if (input && input.connectionModel) {
            let connX = row.xPos + row.width + this.constants_.DARK_PATH_OFFSET;
            if (this.info_.RTL) {
                connX *= -1;
            }
            input.connectionModel.setOffsetInBlock(connX, row.yPos);
        }
    }
    positionNextConnection_() {
        const bottomRow = this.info_.bottomRow;
        if (bottomRow.connection) {
            const connInfo = bottomRow.connection;
            const x = connInfo.xPos; // Already contains info about startX.
            const connX = (this.info_.RTL ? -x : x) + this.constants_.DARK_PATH_OFFSET / 2;
            connInfo.connectionModel.setOffsetInBlock(connX, bottomRow.baseline + this.constants_.DARK_PATH_OFFSET);
        }
    }
}
//# sourceMappingURL=drawer.js.map