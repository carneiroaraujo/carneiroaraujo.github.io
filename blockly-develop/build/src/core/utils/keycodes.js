/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.utils.KeyCodes');
/**
 * Key codes for common characters.
 *
 * Copied from Closure's goog.events.KeyCodes
 *
 * This list is not localized and therefore some of the key codes are not
 * correct for non US keyboard layouts. See comments below.
 */
export var KeyCodes;
(function (KeyCodes) {
    KeyCodes[KeyCodes["WIN_KEY_FF_LINUX"] = 0] = "WIN_KEY_FF_LINUX";
    KeyCodes[KeyCodes["MAC_ENTER"] = 3] = "MAC_ENTER";
    KeyCodes[KeyCodes["BACKSPACE"] = 8] = "BACKSPACE";
    KeyCodes[KeyCodes["TAB"] = 9] = "TAB";
    KeyCodes[KeyCodes["NUM_CENTER"] = 12] = "NUM_CENTER";
    KeyCodes[KeyCodes["ENTER"] = 13] = "ENTER";
    KeyCodes[KeyCodes["SHIFT"] = 16] = "SHIFT";
    KeyCodes[KeyCodes["CTRL"] = 17] = "CTRL";
    KeyCodes[KeyCodes["ALT"] = 18] = "ALT";
    KeyCodes[KeyCodes["PAUSE"] = 19] = "PAUSE";
    KeyCodes[KeyCodes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    KeyCodes[KeyCodes["ESC"] = 27] = "ESC";
    KeyCodes[KeyCodes["SPACE"] = 32] = "SPACE";
    KeyCodes[KeyCodes["PAGE_UP"] = 33] = "PAGE_UP";
    KeyCodes[KeyCodes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KeyCodes[KeyCodes["END"] = 35] = "END";
    KeyCodes[KeyCodes["HOME"] = 36] = "HOME";
    KeyCodes[KeyCodes["LEFT"] = 37] = "LEFT";
    KeyCodes[KeyCodes["UP"] = 38] = "UP";
    KeyCodes[KeyCodes["RIGHT"] = 39] = "RIGHT";
    KeyCodes[KeyCodes["DOWN"] = 40] = "DOWN";
    KeyCodes[KeyCodes["PLUS_SIGN"] = 43] = "PLUS_SIGN";
    KeyCodes[KeyCodes["PRINT_SCREEN"] = 44] = "PRINT_SCREEN";
    KeyCodes[KeyCodes["INSERT"] = 45] = "INSERT";
    KeyCodes[KeyCodes["DELETE"] = 46] = "DELETE";
    KeyCodes[KeyCodes["ZERO"] = 48] = "ZERO";
    KeyCodes[KeyCodes["ONE"] = 49] = "ONE";
    KeyCodes[KeyCodes["TWO"] = 50] = "TWO";
    KeyCodes[KeyCodes["THREE"] = 51] = "THREE";
    KeyCodes[KeyCodes["FOUR"] = 52] = "FOUR";
    KeyCodes[KeyCodes["FIVE"] = 53] = "FIVE";
    KeyCodes[KeyCodes["SIX"] = 54] = "SIX";
    KeyCodes[KeyCodes["SEVEN"] = 55] = "SEVEN";
    KeyCodes[KeyCodes["EIGHT"] = 56] = "EIGHT";
    KeyCodes[KeyCodes["NINE"] = 57] = "NINE";
    KeyCodes[KeyCodes["FF_SEMICOLON"] = 59] = "FF_SEMICOLON";
    KeyCodes[KeyCodes["FF_EQUALS"] = 61] = "FF_EQUALS";
    KeyCodes[KeyCodes["FF_DASH"] = 173] = "FF_DASH";
    // Firefox (Gecko) fires this for # on UK keyboards, rather than
    // Shift+SINGLE_QUOTE.
    KeyCodes[KeyCodes["FF_HASH"] = 163] = "FF_HASH";
    KeyCodes[KeyCodes["QUESTION_MARK"] = 63] = "QUESTION_MARK";
    KeyCodes[KeyCodes["AT_SIGN"] = 64] = "AT_SIGN";
    KeyCodes[KeyCodes["A"] = 65] = "A";
    KeyCodes[KeyCodes["B"] = 66] = "B";
    KeyCodes[KeyCodes["C"] = 67] = "C";
    KeyCodes[KeyCodes["D"] = 68] = "D";
    KeyCodes[KeyCodes["E"] = 69] = "E";
    KeyCodes[KeyCodes["F"] = 70] = "F";
    KeyCodes[KeyCodes["G"] = 71] = "G";
    KeyCodes[KeyCodes["H"] = 72] = "H";
    KeyCodes[KeyCodes["I"] = 73] = "I";
    KeyCodes[KeyCodes["J"] = 74] = "J";
    KeyCodes[KeyCodes["K"] = 75] = "K";
    KeyCodes[KeyCodes["L"] = 76] = "L";
    KeyCodes[KeyCodes["M"] = 77] = "M";
    KeyCodes[KeyCodes["N"] = 78] = "N";
    KeyCodes[KeyCodes["O"] = 79] = "O";
    KeyCodes[KeyCodes["P"] = 80] = "P";
    KeyCodes[KeyCodes["Q"] = 81] = "Q";
    KeyCodes[KeyCodes["R"] = 82] = "R";
    KeyCodes[KeyCodes["S"] = 83] = "S";
    KeyCodes[KeyCodes["T"] = 84] = "T";
    KeyCodes[KeyCodes["U"] = 85] = "U";
    KeyCodes[KeyCodes["V"] = 86] = "V";
    KeyCodes[KeyCodes["W"] = 87] = "W";
    KeyCodes[KeyCodes["X"] = 88] = "X";
    KeyCodes[KeyCodes["Y"] = 89] = "Y";
    KeyCodes[KeyCodes["Z"] = 90] = "Z";
    KeyCodes[KeyCodes["META"] = 91] = "META";
    KeyCodes[KeyCodes["WIN_KEY_RIGHT"] = 92] = "WIN_KEY_RIGHT";
    KeyCodes[KeyCodes["CONTEXT_MENU"] = 93] = "CONTEXT_MENU";
    KeyCodes[KeyCodes["NUM_ZERO"] = 96] = "NUM_ZERO";
    KeyCodes[KeyCodes["NUM_ONE"] = 97] = "NUM_ONE";
    KeyCodes[KeyCodes["NUM_TWO"] = 98] = "NUM_TWO";
    KeyCodes[KeyCodes["NUM_THREE"] = 99] = "NUM_THREE";
    KeyCodes[KeyCodes["NUM_FOUR"] = 100] = "NUM_FOUR";
    KeyCodes[KeyCodes["NUM_FIVE"] = 101] = "NUM_FIVE";
    KeyCodes[KeyCodes["NUM_SIX"] = 102] = "NUM_SIX";
    KeyCodes[KeyCodes["NUM_SEVEN"] = 103] = "NUM_SEVEN";
    KeyCodes[KeyCodes["NUM_EIGHT"] = 104] = "NUM_EIGHT";
    KeyCodes[KeyCodes["NUM_NINE"] = 105] = "NUM_NINE";
    KeyCodes[KeyCodes["NUM_MULTIPLY"] = 106] = "NUM_MULTIPLY";
    KeyCodes[KeyCodes["NUM_PLUS"] = 107] = "NUM_PLUS";
    KeyCodes[KeyCodes["NUM_MINUS"] = 109] = "NUM_MINUS";
    KeyCodes[KeyCodes["NUM_PERIOD"] = 110] = "NUM_PERIOD";
    KeyCodes[KeyCodes["NUM_DIVISION"] = 111] = "NUM_DIVISION";
    KeyCodes[KeyCodes["F1"] = 112] = "F1";
    KeyCodes[KeyCodes["F2"] = 113] = "F2";
    KeyCodes[KeyCodes["F3"] = 114] = "F3";
    KeyCodes[KeyCodes["F4"] = 115] = "F4";
    KeyCodes[KeyCodes["F5"] = 116] = "F5";
    KeyCodes[KeyCodes["F6"] = 117] = "F6";
    KeyCodes[KeyCodes["F7"] = 118] = "F7";
    KeyCodes[KeyCodes["F8"] = 119] = "F8";
    KeyCodes[KeyCodes["F9"] = 120] = "F9";
    KeyCodes[KeyCodes["F10"] = 121] = "F10";
    KeyCodes[KeyCodes["F11"] = 122] = "F11";
    KeyCodes[KeyCodes["F12"] = 123] = "F12";
    KeyCodes[KeyCodes["NUMLOCK"] = 144] = "NUMLOCK";
    KeyCodes[KeyCodes["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
    // OS-specific media keys like volume controls and browser controls.
    KeyCodes[KeyCodes["FIRST_MEDIA_KEY"] = 166] = "FIRST_MEDIA_KEY";
    KeyCodes[KeyCodes["LAST_MEDIA_KEY"] = 183] = "LAST_MEDIA_KEY";
    KeyCodes[KeyCodes["SEMICOLON"] = 186] = "SEMICOLON";
    KeyCodes[KeyCodes["DASH"] = 189] = "DASH";
    KeyCodes[KeyCodes["EQUALS"] = 187] = "EQUALS";
    KeyCodes[KeyCodes["COMMA"] = 188] = "COMMA";
    KeyCodes[KeyCodes["PERIOD"] = 190] = "PERIOD";
    KeyCodes[KeyCodes["SLASH"] = 191] = "SLASH";
    KeyCodes[KeyCodes["APOSTROPHE"] = 192] = "APOSTROPHE";
    KeyCodes[KeyCodes["TILDE"] = 192] = "TILDE";
    KeyCodes[KeyCodes["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
    KeyCodes[KeyCodes["OPEN_SQUARE_BRACKET"] = 219] = "OPEN_SQUARE_BRACKET";
    KeyCodes[KeyCodes["BACKSLASH"] = 220] = "BACKSLASH";
    KeyCodes[KeyCodes["CLOSE_SQUARE_BRACKET"] = 221] = "CLOSE_SQUARE_BRACKET";
    KeyCodes[KeyCodes["WIN_KEY"] = 224] = "WIN_KEY";
    KeyCodes[KeyCodes["MAC_FF_META"] = 224] = "MAC_FF_META";
    KeyCodes[KeyCodes["MAC_WK_CMD_LEFT"] = 91] = "MAC_WK_CMD_LEFT";
    KeyCodes[KeyCodes["MAC_WK_CMD_RIGHT"] = 93] = "MAC_WK_CMD_RIGHT";
    KeyCodes[KeyCodes["WIN_IME"] = 229] = "WIN_IME";
    // "Reserved for future use". Some programs (e.g. the SlingPlayer 2.4 ActiveX
    // control) fire this as a hacky way to disable screensavers.
    KeyCodes[KeyCodes["VK_NONAME"] = 252] = "VK_NONAME";
    // We've seen users whose machines fire this keycode at regular one
    // second intervals. The common thread among these users is that
    // they're all using Dell Inspiron laptops, so we suspect that this
    // indicates a hardware/bios problem.
    // http://en.community.dell.com/support-forums/laptop/f/3518/p/19285957/19523128.aspx
    KeyCodes[KeyCodes["PHANTOM"] = 255] = "PHANTOM";
})(KeyCodes || (KeyCodes = {}));
//# sourceMappingURL=keycodes.js.map