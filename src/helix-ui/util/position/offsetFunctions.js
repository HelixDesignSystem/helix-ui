/**
 * [x,y] coordinate array
 * @typedef {Array} XYCoordinate
 */

/**
 * @module
 * @description
 * Each function calculates the (x,y) coordinates of a target element,
 * so that it is positioned in relation to a reference element.
 *
 * If you wanted to position a menu below a button, the button
 * is the reference element, and the menu is the target element.
 *
 * ![position reference](/images/api/positioning_ref.png)
 */

/**
 * Calculate (x,y) coordinates needed to center align two elements.
 *
 * ![center reference](/images/api/pos-center.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @return {XYCoordinate}
 */
function getCenter (off, ref) {
    let x = ref.left + (ref.width / 2) - (off.width / 2);
    let y = ref.top + (ref.height / 2) - (off.height / 2);
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element above a
 * reference element, with their y-axes aligned.
 *
 * ![top reference](/images/api/pos-top.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getTop (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top - off.height;
    y -= config.margin;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element below a
 * reference element, with their y-axes aligned.
 *
 * ![bottom reference](/images/api/pos-bottom.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getBottom (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top + ref.height;
    y += config.margin;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element left of a
 * reference element, with their x-axes aligned.
 *
 * ![left reference](/images/api/pos-left.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getLeft (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left - off.width - config.margin;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element right of a
 * reference element, with their x-axes aligned.
 *
 * ![right reference](/images/api/pos-right.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getRight (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left + ref.width + config.margin;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * left of a reference element, so that the right edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * ![top-left reference](/images/api/pos-top-left.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getTopLeft (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * left of a reference element, so that the left edge of the target element aligns
 * with the left edge of the reference element.
 *
 * ![top-start reference](/images/api/pos-top-start.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getTopStart (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * right of a reference element, so that the right edge of the target element aligns
 * with the right edge of the reference element.
 *
 * ![top-end reference](/images/api/pos-top-end.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getTopEnd (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element above and to the
 * right of a reference element, so that the left edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * ![top-right reference](/images/api/pos-top-right.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getTopRight (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x += (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly higher
 * than the target element, so that the bottom edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * ![right-top reference](/images/api/pos-right-top.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getRightTop (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y -= (off.height / 2);
    y += config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly higher
 * than the target element, so that the top edge of the target element aligns with the
 * top edge of the reference element.
 *
 * ![right-start reference](/images/api/pos-right-start.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getRightStart (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly lower
 * than the target element, so that the bottom edge of the target element aligns with the
 * bottom edge of the reference element.
 *
 * ![right-end reference](/images/api/pos-right-end.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getRightEnd (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element right and slightly lower
 * than the target element, so that the top edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * ![right-bottom reference](/images/api/pos-right-bottom.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getRightBottom (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * right of a reference element, so that the left edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * ![bottom-right reference](/images/api/pos-bottom-right.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getBottomRight (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x += (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * right of a reference element, so that the right edge of the target element aligns
 * with the right edge of the reference element.
 *
 * ![bottom-end reference](/images/api/pos-bottom-end.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getBottomEnd (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * left of a reference element, so that the left edge of the target element aligns
 * with the left edge of the reference element.
 *
 * ![bottom-start reference](/images/api/pos-bottom-start.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getBottomStart (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element below and to the
 * left of a reference element, so that the right edge of the target element aligns
 * with the y-axis of the reference element.
 *
 * ![bottom-left reference](/images/api/pos-bottom-left.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getBottomLeft (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly lower
 * than the target element, so that the top edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * ![left-bottom reference](/images/api/pos-left-bottom.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getLeftBottom (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly lower
 * than the target element, so that the bottom edge of the target element aligns with the
 * bottom edge of the reference element.
 *
 * ![left-end reference](/images/api/pos-left-end.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getLeftEnd (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly higher
 * than the target element, so that the top edge of the target element aligns with the
 * top edge of the reference element.
 *
 * ![left-start reference](/images/api/pos-left-start.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getLeftStart (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

/**
 * Calculate (x,y) coordinates needed to position a target element left and slightly higher
 * than the target element, so that the bottom edge of the target element aligns with the
 * x-axis of the reference element.
 *
 * ![left-top reference](/images/api/pos-left-top.png)
 *
 * @param {HTMLElement} off - target element
 * @param {HTMLElement} ref - reference element
 * @param {PositionConfig} config - position configuration
 * @return {XYCoordinate}
 */
function getLeftTop (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y -= (off.height / 2);
    y += config.offset;
    return [ x, y ];
}

const offsetFunctions = {
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

export default offsetFunctions;
