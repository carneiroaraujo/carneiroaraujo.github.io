/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.utils.userAgent');
/** The raw useragent string. */
let rawUserAgent;
let isJavaFx;
let isWebKit;
let isGecko;
let isAndroid;
let isIPad;
let isIPhone;
let isMac;
let isTablet;
let isMobile;
(function (raw) {
    rawUserAgent = raw;
    const rawUpper = rawUserAgent.toUpperCase();
    /**
     * Case-insensitive test of whether name is in the useragent string.
     *
     * @param name Name to test.
     * @returns True if name is present.
     */
    function has(name) {
        return rawUpper.indexOf(name.toUpperCase()) !== -1;
    }
    // Browsers.  Logic from:
    // https://github.com/google/closure-library/blob/master/closure/goog/labs/useragent/browser.js
    // Useragent for JavaFX:
    // Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.44
    //     (KHTML, like Gecko) JavaFX/8.0 Safari/537.44
    isJavaFx = has('JavaFX');
    // Engines.  Logic from:
    // https://github.com/google/closure-library/blob/master/closure/goog/labs/useragent/engine.js
    isWebKit = has('WebKit');
    isGecko = has('Gecko') && !isWebKit;
    // Platforms.  Logic from:
    // https://github.com/google/closure-library/blob/master/closure/goog/labs/useragent/platform.js
    // and
    // https://github.com/google/closure-library/blob/master/closure/goog/labs/useragent/extra.js
    isAndroid = has('Android');
    const maxTouchPoints = globalThis['navigator'] && globalThis['navigator']['maxTouchPoints'];
    isIPad = has('iPad') || has('Macintosh') && maxTouchPoints > 0;
    isIPhone = has('iPhone') && !isIPad;
    isMac = has('Macintosh');
    // Devices.  Logic from:
    // https://github.com/google/closure-library/blob/master/closure/goog/labs/useragent/device.js
    isTablet = isIPad || isAndroid && !has('Mobile') || has('Silk');
    isMobile = !isTablet && (isIPhone || isAndroid);
})(globalThis['navigator'] && globalThis['navigator']['userAgent'] || '');
export const raw = rawUserAgent;
export const JavaFx = isJavaFx;
export const GECKO = isGecko;
export const ANDROID = isAndroid;
export const IPAD = isIPad;
export const IPHONE = isIPhone;
export const MAC = isMac;
export const MOBILE = isMobile;
//# sourceMappingURL=useragent.js.map