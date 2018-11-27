/**
 * @module HelixUI/Utils/Position
 */
import Offset, { offsetFunctionMap } from './offset';

/**
 * @typedef {Object} PositionConfig
 * @prop {Element} element - element to position
 * @prop {Element} reference - reference element used to calculate position of the offset element
 * @prop {String} [position=center] - position of offsetElement in relation to referenceElement
 * @prop {Integer} [margin=0] - distance in pixels between offset element and reference element
 * @prop {Integer} [offset=0] - offset in pixels towards the center axis
 */

/**
 * @typedef {Object} Position
 * @description
 * Position metadata used to update visual state of a positioned element.
 * @prop {String} position - calculated position based on collision detection logic
 * @prop {Integer} x - x coordinate in relation to the viewport
 * @prop {Integer} y - y coordinate in relation to the viewport
 */

/**
 * @typedef {Enum<Boolean>} ViewportCollisions
 * @description
 * metadata object with boolean values to quickly
 * identify which sides of an element are outside the viewport
 *
 * @prop {Boolean} anywhere - true if any edge is outside of viewport
 * @prop {Boolean} bottom - true if bottom edge is outside of viewport
 * @prop {Boolean} horizontal - true if left or right edge is outside of viewport
 * @prop {Boolean} left - true if left edge is outside of viewport
 * @prop {Boolean} right - true if right edge is outside of viewport
 * @prop {Boolean} top - true if top edge is outside of viewport
 * @prop {Boolean} vertical - true if top or bottom edge is outside of viewport
 */

const DEFAULT_CONFIG = {
    margin: 0,
    offset: 0,
    position: 'center',
};

const VerticalOpposites = {
    'top': 'bottom',
    'top-right': 'bottom-right',
    'top-left': 'bottom-left',
    'top-start': 'bottom-start',
    'top-end': 'bottom-end',
    'right': 'right',
    'right-top': 'right-bottom',
    'right-bottom': 'right-top',
    'right-start': 'right-end',
    'right-end': 'right-start',
    'bottom': 'top',
    'bottom-right': 'top-right',
    'bottom-left': 'top-left',
    'bottom-start': 'top-start',
    'bottom-end': 'top-end',
    'left': 'left',
    'left-top': 'left-bottom',
    'left-bottom': 'left-top',
    'left-start': 'left-end',
    'left-end': 'left-start',
};

const HorizontalOpposites = {
    'top': 'top',
    'top-right': 'top-left',
    'top-left': 'top-right',
    'top-start': 'top-end',
    'top-end': 'top-start',
    'right': 'left',
    'right-top': 'left-top',
    'right-bottom': 'left-bottom',
    'right-start': 'left-start',
    'right-end': 'left-end',
    'bottom': 'bottom',
    'bottom-right': 'bottom-left',
    'bottom-left': 'bottom-right',
    'bottom-start': 'bottom-end',
    'bottom-end': 'bottom-start',
    'left': 'right',
    'left-top': 'right-top',
    'left-bottom': 'right-bottom',
    'left-start': 'right-start',
    'left-end': 'right-end',
};

/**
 * Calculate the top, right, bottom, and left x/y values of
 * an element at given coordinates.
 *
 * @param {HTMLElement} element
 * @param {Coordinate} coord - { x, y } coordinate
 *
 * @returns {Object} Calculated, DOMRect-like object
 * with `bottom`, `left`, `right`, and `top` properties.
 */
function _getRectAtCoords (element, coord) {
    let { x, y } = coord;
    let { height, width } = element.getBoundingClientRect();

    return {
        bottom: y + height,
        left: x,
        right: x + width,
        top: y,
    };
}

/**
 * Translate a position configuration into offset options
 *
 * @param {PositionConfig} config - position configuration
 * @returns {OffsetOptions}
 */
function _getOffsetOptions (config) {
    let isLeftOrRight = /^(left|right)/.test(config.position);

    let margin = config.margin || 0;
    let offset = config.offset || 0;

    // Deltas
    let dX = isLeftOrRight ? margin : offset;
    let dY = isLeftOrRight ? offset : margin;

    /*
     * Invert dX to shift positioned element LEFT
     *
     *  - top-right
     *  - top-end
     *  - bottom-right
     *  - bottom-end
     */
    if (/^(top|bottom)-(right|end)/.test(config.position)) {
        dX = -dX;
    }

    /*
     * Invert dY to shift positioned element UP
     *
     *  - left-bottom
     *  - left-end
     *  - right-bottom
     *  - right-end
     */
    if (/^(left|right)-(bottom|end)/.test(config.position)) {
        dY = -dY;
    }

    return { dX, dY };
}

/**
 * Calculate _fixed_ coordinates of an offset element in relation to a reference element.
 *
 * Translates margin and offset to dX and dY
 *
 * @param {PositionConfig} config - position configuration object
 *
 * @returns {Coordinates}
 */
function _getCoords (config) {
    let offRect = config.element.getBoundingClientRect();
    let refRect = config.reference.getBoundingClientRect();

    let opts = _getOffsetOptions(config);
    let _calculate = offsetFunctionMap[config.position];

    let coords = _calculate(offRect, refRect, opts);

    return coords;
}

/**
 * Determine if any side of an element is obscured by the viewport.
 *
 * @param {PositionCOnfig} config - position configuration
 * @param {Object} coords - (x,y) coordinates
 *
 * @returns {ViewportCollisions}
 */
function _getViewportCollisions (config, coords) {
    let { element } = config;
    let rect = _getRectAtCoords(element, coords);

    let bottom = rect.bottom > window.innerHeight;
    let left = rect.left < 0;
    let right = rect.right > window.innerWidth;
    let top = rect.top < 0;
    let vertically = (top || bottom);
    let horizontally = (left || right);
    let anywhere = (vertically || horizontally);

    return {
        anywhere,
        bottom,
        horizontally,
        left,
        right,
        top,
        vertically,
    };
}

/**
 * Modify the position of an element so that it appears toward
 * the center of the viewport.
 *
 * @param {PositionConfig} config - position configuration
 * @param {ViewportCollisions} isOffscreen - offscreen metadata
 *
 * @returns {String} corrected position
 */
function _repositionTowardCenter (config, isOffscreen) {
    let { position } = config;

    if (isOffscreen.vertically) {
        position = VerticalOpposites[position];
    }

    if (isOffscreen.horizontally) {
        position = HorizontalOpposites[position];
    }

    return position;
}

/**
 * Calculate coordinates of an element in relation to a reference element
 * while attempting to keep the element visible in the viewport.
 *
 * @param {PositionConfig} config - position configuration
 *
 * @returns {Position}
 */
export function getPosition (config) {
    let _config = Object.assign({}, DEFAULT_CONFIG, config);

    if (!_config.element) {
        throw 'The "element" configuration property must be defined.';
    }

    if (!_config.reference) {
        throw 'The "reference" configuration property must be defined.';
    }

    let { position } = _config;
    let coords = _getCoords(_config);
    let isOffscreen = _getViewportCollisions(_config, coords);

    if (isOffscreen.anywhere) {
        let newConfig = Object.assign({}, _config);

        newConfig.position = _repositionTowardCenter(newConfig, isOffscreen);

        // recalculate coords
        let newCoords = _getCoords(newConfig);

        // double check collisions
        isOffscreen = _getViewportCollisions(newConfig, newCoords);
        if (!isOffscreen.anywhere) {
            coords = newCoords;
            position = newConfig.position;
        }
    }

    let { x, y } = coords;

    return { position, x, y };
}

/**
 * Calculate coordinates of an element in relation to a reference element
 * while attempting to keep the element visible in the viewport.
 *
 * @param {PositionConfig} config - position configuration
 *
 * @returns {Position}
 */
export function getPositionWithArrow (config) {
    let _config = Object.assign({}, DEFAULT_CONFIG, config);
    _config.offset = 20;

    /*
     * Remove offset if position is "top", "bottom", "left", or "right",
     * so that the point of the arrow always aligns to the center of
     * the reference element.
     */
    if (/^(left|right|top|bottom)$/.test(_config.position)) {
        _config.offset = 0;
    }

    return getPosition(_config);
}

export default {
    Offset,
    getPosition,
    getPositionWithArrow,
};
