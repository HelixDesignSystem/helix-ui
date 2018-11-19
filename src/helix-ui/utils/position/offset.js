/**
 * @module HelixUI/Utils/Position/Offset
 * @description
 * Utilities to calculate coordinates of an offset element
 * in relation to a relative element.
 *
 * @example <caption>Positioning a menu below a button</caption>
 * let elOffset = document.querySelector('menu');
 * let elReference = document.querySelector('button');
 *
 * // grab bounding DOMRects
 * let offRect = elOffset.getBoundingClientRect();
 * let refRect = elRef.getBoundingClientRect();
 *
 * // Calculate coordinates
 * let { x, y } = getBottom(offRect, refRect);
 */

/**
 * @external DOMRect
 * @description Object returned by Element.getBoundingClientRect().
 *
 * - MDN: [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect)
 */

/**
 * @typedef {Object} Coordinates
 * @prop {Integer} x - X coordinate
 * @prop {Integer} y - Y coordinate
 */

/**
 * @typedef {Object} Delta
 * @description
 * Calculated metadata
 *
 * @prop {Integer} dH - height difference between target element and offset element
 * @prop {Integer} dW - width difference between target element and offset element
 * @prop {Integer} dX - X delta (a positive value shifts the target RIGHT)
 * @prop {Integer} dY - Y delta (a positive value shifts the target DOWN)
 */

/**
 * @typedef {Object} OffsetOptions
 * @description
 * Offset configuration object
 *
 * @default {}
 * @prop {Integer} [dX=0] - X offset (a positive value shifts the target RIGHT)
 * @prop {Integer} [dY=0] - Y offset (a positive value shifts the target DOWN)
 */

/**
 * Utility function to calculate delta metadata
 *
 * @private
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Delta}
 */
function _getDeltas (off, ref, opts = {}) {
    // height delta
    let dH = ref.height - off.height;
    // width delta
    let dW = ref.width - off.width;
    // X delta
    let dX = opts.dX || 0;
    // Y delta
    let dY = opts.dY || 0;

    return { dH, dW, dX, dY };
}

/**
 * Calculate { x, y } coordinates needed to center align two elements.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getCenter (off, ref, opts = {}) {
    let { dW, dH, dX, dY } = _getDeltas(off, ref, opts);

    let x = ref.left + (dW / 2) + dX;
    let y = ref.top + (dH / 2) + dY;

    return { x, y };
}

/**
 * Calculate { x, y } coordinates needed to position a target element above a
 * reference element, with their y-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getTop (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getCenter(off, ref, opts);
    let y = ref.top - off.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below a
 * reference element, with their y-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getBottom (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getCenter(off, ref, opts);
    let y = ref.top + ref.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left of a
 * reference element, with their x-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getLeft (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let { y } = getCenter(off, ref, opts);
    let x = ref.left - off.width + dX;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right of a
 * reference element, with their x-axes aligned.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getRight (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let { y } = getCenter(off, ref, opts);
    let x = ref.left + ref.width + dX;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * left of a reference element, so that the right edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getTopLeft (off, ref, opts) {
    let { x: xT, y } = getTop(off, ref, opts);
    let x = xT - (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * left of a reference element, so that the left edge of the target element aligns
 * with the left edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getTopStart (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let x = ref.left + dX;
    let { y } = getTop(off, ref, opts);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * right of a reference element, so that the right edge of the target element aligns
 * with the right edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getTopEnd (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let x = ref.right - off.width + dX;
    let { y } = getTop(off, ref, opts);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * right of a reference element, so that the left edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getTopRight (off, ref, opts) {
    let { x: xT, y } = getTop(off, ref, opts);
    let x = xT + (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly higher
 * than the target element, so that the bottom edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getRightTop (off, ref, opts) {
    let { y: yR, x } = getRight(off, ref, opts);
    let y = yR - (off.height / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly higher
 * than the target element, so that the top edge of the target element aligns with the
 * top edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getRightStart (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getRight(off, ref, opts);
    let y = ref.top + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly lower
 * than the target element, so that the bottom edge of the target element aligns with the
 * bottom edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getRightEnd (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getRight(off, ref, opts);
    let y = ref.bottom - off.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and
 * slightly lower than the target element, so that the top edge of the target
 * element aligns with the x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getRightBottom (off, ref, opts) {
    let { x, y: yR } = getRight(off, ref, opts);
    let y = yR + (off.height / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * right of a reference element, so that the left edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getBottomRight (off, ref, opts) {
    let { x: xB, y } = getBottom(off, ref, opts);
    let x = xB + (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * right of a reference element, so that the right edge of the target element aligns
 * with the right edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getBottomEnd (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let x = ref.right - off.width + dX;
    let { y } = getBottom(off, ref, opts);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * left of a reference element, so that the left edge of the target element aligns
 * with the left edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getBottomStart (off, ref, opts) {
    let { dX } = _getDeltas(off, ref, opts);
    let { y } = getBottom(off, ref, opts);
    let x = ref.left + dX;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * left of a reference element, so that the right edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getBottomLeft (off, ref, opts) {
    let { x: xB, y } = getBottom(off, ref, opts);
    let x = xB - (off.width / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly lower
 * than the target element, so that the top edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getLeftBottom (off, ref, opts) {
    let { x, y: yL } = getLeft(off, ref, opts);
    let y = yL + (off.height / 2);

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly lower
 * than the target element, so that the bottom edge of the target element aligns with the
 * bottom edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getLeftEnd (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);

    let { x } = getLeft(off, ref, opts);
    let y = ref.bottom - off.height + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly higher
 * than the target element, so that the top edge of the target element aligns with the
 * top edge of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getLeftStart (off, ref, opts) {
    let { dY } = _getDeltas(off, ref, opts);
    let { x } = getLeft(off, ref, opts);
    let y = ref.top + dY;

    return { x, y };
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly higher
 * than the target element, so that the bottom edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * @param {DOMRect} off - bounding rectangle for the target element
 * @param {DOMRect} ref - bounding rectangle for the reference element
 * @param {OffsetOptions} [opts={}] - offset configuration
 * @returns {Coordinates}
 */
export function getLeftTop (off, ref, opts) {
    let { x, y: yL } = getLeft(off, ref, opts);
    let y = yL - (off.height / 2);

    return { x, y };
}

/**
 * Key/value map of position values and their respective offset calculation function
 *
 * @enum {Function}
 * @name offsetFunctionMap
 */
export const offsetFunctionMap = {
    'top-left': getTopLeft,
    'top-start': getTopStart,
    'top': getTop,
    'top-end': getTopEnd,
    'top-right': getTopRight,
    'right-top': getRightTop,
    'right-start': getRightStart,
    'right': getRight,
    'right-end': getRightEnd,
    'right-bottom': getRightBottom,
    'bottom-right': getBottomRight,
    'bottom-end': getBottomEnd,
    'bottom': getBottom,
    'bottom-start': getBottomStart,
    'bottom-left': getBottomLeft,
    'left-bottom': getLeftBottom,
    'left-end': getLeftEnd,
    'left': getLeft,
    'left-start': getLeftStart,
    'left-top': getLeftTop,
    'center': getCenter,
};

export default {
    getBottom,
    getBottomEnd,
    getBottomLeft,
    getBottomRight,
    getBottomStart,
    getCenter,
    getLeft,
    getLeftBottom,
    getLeftEnd,
    getLeftStart,
    getLeftTop,
    getRight,
    getRightBottom,
    getRightEnd,
    getRightStart,
    getTop,
    getTopEnd,
    getTopLeft,
    getTopRight,
    getTopStart,
    offsetFunctionMap,
};
