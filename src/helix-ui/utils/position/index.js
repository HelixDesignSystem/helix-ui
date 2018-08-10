/**
 * @module HelixUI/Utils/Position
 */
import Offset, { offsetFunctionMap } from './offset';

/**
 * @typedef {Object} PositionConfig
 * @prop {PositionString} [position=top] - position of offsetElement in relation to referenceElement
 * @prop {Integer} [margin=0] - distance in pixels between offset element and reference element
 * @prop {Integer} [offset=0] - offset in pixels towards the center axis
 */

/**
 * @typedef {Object} XYPosition
 * @description
 * Absolute (x,y) coordinates and metadata for positioning a target element
 * in relation to a reference element.
 * @prop {PositionString} position
 * @prop {Integer} x
 * @prop {Integer} y
 */

/**
 * @typedef {String} PositionString
 * @description
 * Valid values:
 *
 *   - `center`
 *   - `top-left`
 *   - `top-start`
 *   - `top`
 *   - `top-end`
 *   - `top-right`
 *   - `right-top`
 *   - `right-start`
 *   - `right`
 *   - `right-end`
 *   - `right-bottom`
 *   - `bottom-right`
 *   - `bottom-end`
 *   - `bottom`
 *   - `bottom-start`
 *   - `bottom-left`
 *   - `left-bottom`
 *   - `left-end`
 *   - `left`
 *   - `left-start`
 *   - `left-top`
 */

/**
 * @name verticalOpposites
 * @type {Object}
 * @description Position value map of vertical opposites.
 *
 * - `top` &rarr; `bottom`
 * - `right-start` &rarr; `right-end`
 * - `left-bottom` &rarr; `left-top`
 * - etc.
 */
export const verticalOpposites = {
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

/**
 * @name horizontalOpposites
 * @type {Object}
 * @description Position value map of horizontal opposites.
 *
 * - `left` &rarr; `right`
 * - `top-left` &rarr; `top-right`
 * - `bottom-start` &rarr; `bottom-end`
 * - etc.
 */
export const horizontalOpposites = {
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
 * @param {Object} coord - (x,y) coordinates
 */
function _getElementBox (element, coord) {
    let boundingRect = element.getBoundingClientRect();

    return {
        top: coord.y,
        right: coord.x + boundingRect.width,
        bottom: coord.y + boundingRect.height,
        left: coord.x,
    };
}

/**
 * Calculate coordinates of an element in relation to a reference element.
 *
 * @param {String} position - the position of the offset element
 * @param {HTMLElement} offsetElement - the element to calculate (x,y) coordinates
 * @param {HTMLElement} referenceElement - the element that is being offset from
 * @param {PositionConfig} config - configuration object
 *
 * @returns {XYPosition}
 */
function _getCoords (position, offsetElement, referenceElement, config) {
    // The 'position' property is added to provide information about final
    // calculated position of offset element in relation to reference element
    let coords = {
        x: 0,
        y: 0,
        position,
    };

    let offRect = offsetElement.getBoundingClientRect();
    let refRect = referenceElement.getBoundingClientRect();

    [ coords.x, coords.y ] = offsetFunctionMap[position](offRect, refRect, config);
    coords.x += window.pageXOffset;
    coords.y += window.pageYOffset;

    return coords;
}

/**
 * Determine if any side of an element is obscured by the viewport.
 *
 * @param {HTMLElement} element - the element to check against the viewport
 * @param {Object} coords - (x,y) coordinates
 *
 * @returns {Object} metadata object with boolean values to quickly
 * identify which sides of an element are outside the viewport
 */
function _getOffscreenMetadata (element, coords) {
    let elementBox = _getElementBox(element, coords);
    let viewportBox = {
        top: window.pageYOffset,
        right: window.innerWidth + window.pageXOffset,
        bottom: window.innerHeight + window.pageYOffset,
        left: window.pageXOffset,
    };

    let offscreen = {
        top: elementBox.top < viewportBox.top,
        right: elementBox.right > viewportBox.right,
        bottom: elementBox.bottom > viewportBox.bottom,
        left: elementBox.left < viewportBox.left,
    };

    offscreen.vertically = (offscreen.top || offscreen.bottom);
    offscreen.horizontally = (offscreen.left || offscreen.right);
    offscreen.anywhere = (offscreen.vertically || offscreen.horizontally);

    return offscreen;
}

/**
 * Modify the position of an element so that it appears toward
 * the center of the viewport.
 *
 * @param {String} position - the current position
 * @param {Object} offscreen - offscreen metadata
 *
 * @returns {String} corrected position
 */
function _repositionTowardCenter (position, offscreen) {
    if (offscreen.vertically) {
        position = verticalOpposites[position];
    }

    if (offscreen.horizontally) {
        position = horizontalOpposites[position];
    }

    return position;
}

/**
 * Calculate coordinates of an element in relation to a reference element
 * while attempting to keep the element visible in the viewport.
 *
 * @param {Element} offsetElement - element to position
 * @param {Element} referenceElement - reference element used to calculate position of offsetElement
 * @param {PositionConfig} config - configuration object
 *
 * @returns {XYPosition}
 */
export function getPosition (offsetElement, referenceElement, config) {
    let defaults = {
        position: 'top',
        margin: 0,
        offset: 0,
    };
    let cfg = Object.assign({}, defaults, config);

    let coords = _getCoords(cfg.position, offsetElement, referenceElement, cfg);
    let isOffscreen = _getOffscreenMetadata(offsetElement, coords);

    if (isOffscreen.anywhere) {
        let newPosition = _repositionTowardCenter(cfg.position, isOffscreen);
        let newCoords = _getCoords(newPosition, offsetElement, referenceElement, cfg);

        //If the repositioned element is no longer offscreen,
        //use the respositioned element coordinates
        isOffscreen = _getOffscreenMetadata(offsetElement, newCoords);
        if (!isOffscreen.anywhere) {
            coords = newCoords;
        }
    }

    return coords;
}

/**
 * Calculate coordinates of an element in relation to a reference element
 * while attempting to keep the element visible in the viewport.
 *
 * @param {Element} offsetElement - element to position
 * @param {Element} referenceElement - reference element used to calculate position of offsetElement
 *
 * @param {PositionConfig} config - configuration object
 * @param {Integer} [config.margin=12] - distance in pixels between the base and the tip of the arrow
 * @param {Integer} [config.offset=20] - distance in pixels from the edge of the
 * offset element to the center of the arrow
 *
 * @returns {XYPosition}
 */
export function getPositionWithArrow (offsetElement, referenceElement, config) {
    let defaults = {
        margin: 12, // base to tip of the arrow
        offset: 20, // distance from the edge to the center of the arrow
    };

    let cfg = Object.assign({}, defaults, config);

    return getPosition(offsetElement, referenceElement, cfg);
}

export default {
    Offset,
    getPosition,
    getPositionWithArrow,
};
