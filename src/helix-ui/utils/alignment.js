/**
 * @module HelixUI/Utils/Alignment
 * @description
 * Alignment logic in regards to positioning
 *
 * See https://codepen.io/CITguy/pen/b1286136d695391a40a6d708b765361c
 */

/**
 * @typedef {String} AlignmentString
 * @global
 *
 * @description
 * Positions are composed of alignments (e.g., the position `top-left`
 * has alignments `top` and `left`).  Some alignments are axis-specific,
 * while others are not. Alignments `start` and `end` may apply to either
 * horizontal (x-axis) alignment OR vertical (y-axis) aligment.
 *
 * Values:
 * - `bottom`
 * - `center`
 * - `end`
 * - `left`
 * - `middle`
 * - `right`
 * - `start`
 * - `top`
 */

/**
 * @typedef {String} PositionString
 * @global
 *
 * @description
 *
 * **Supported Positions**
 *
 * The following, normalized values are suported.
 * - `bottom-start`
 * - `bottom-left`
 * - `bottom-center`
 * - `bottom-right`
 * - `bottom-end`
 * - `center-middle`
 * - `left-start`
 * - `left-top`
 * - `left-middle`
 * - `left-bottom`
 * - `left-end`
 * - `right-start`
 * - `right-top`
 * - `right-middle`
 * - `right-bottom`
 * - `right-end`
 * - `top-start`
 * - `top-left`
 * - `top-center`
 * - `top-right`
 * - `top-end`
 *
 *
 * **Deprecated Positions**
 *
 * Support for the following values will be removed in a future release.
 * - `bottom`
 * - `center`
 * - `left`
 * - `right`
 * - `top`
 */

const OPPOSITE_ALIGNMENTS = {
    'bottom': 'top',
    'center': 'center',
    'end': 'start',
    'left': 'right',
    'middle': 'middle',
    'right': 'left',
    'start': 'end',
    'top': 'bottom',
};

/**
 * Convert position string into vertical alignment, horizontal alignment,
 * and main axis properties.
 *
 * @param {PositionString} position user-configured position string
 * @returns {Object} alignment metadata
 */
export function getAlignment (position) {
    let crossAlign; // cross-axis alignment
    let crossAxis = getCrossAxis(position);
    let mainAlign; // main-axis alignment
    let mainAxis = getMainAxis(position);
    // x-axis and y-axis alignment (in relation to viewport coordinates)
    let yAlign = getVerticalAlignment(position);
    let xAlign = getHorizontalAlignment(position);

    // https://regex101.com/r/1oRJf8/7
    let startEndMatch = position.match(/(start|end)$/);
    if (startEndMatch) {
        if (mainAxis === 'x') {
            yAlign = startEndMatch[0];
        } else {
            xAlign = startEndMatch[0];
        }
    }

    // determine main-axis and cross-axis alignment
    if (mainAxis === 'x') {
        mainAlign = xAlign;
        crossAlign = yAlign;
    } else {
        mainAlign = yAlign;
        crossAlign = xAlign;
    }

    return {
        crossAlign,
        crossAxis,
        mainAlign,
        mainAxis,
        xAlign,
        yAlign,
    };
}

/**
 * Determine secondary axis (x or y; opposite of main axis) from position.
 *
 * @param {PositionString} position
 * @returns {Enum<String>}
 */
export function getCrossAxis (position) {
    return (getMainAxis(position) === 'x' ? 'y' : 'x');
}

/**
 * Determine x-axis alignment from position
 *
 * @param {PositionString} position
 * @returns {AlignmentString}
 */
export function getHorizontalAlignment (position) {
    let xAlign = 'center';

    // https://regex101.com/r/1oRJf8/5
    let hMatch = position.match(/^(left|right)|(left|right)$/);
    if (hMatch) {
        xAlign = hMatch[0];
    }

    return xAlign;
}

/**
 * Determine primary axis (x or y) from position
 *
 * @param {PositionString} position
 * @returns {Enum}
 */
export function getMainAxis (position) {
    // https://regex101.com/r/1oRJf8/1
    if (/^(top|bottom)/.test(position)) {
        return 'y';
    } else {
        return 'x';
    }
}

/**
 * Determine y-axis alignment from position
 *
 * @param {PositionString} position
 * @returns {AlignmentString}
 */
export function getVerticalAlignment (position) {
    let yAlign = 'middle';

    // https://regex101.com/r/1oRJf8/4
    let vMatch = position.match(/^(top|bottom)|(top|bottom)$/);
    if (vMatch) {
        yAlign = vMatch[0];
    }

    return yAlign;
}

/**
 * Calculates position string that is horizontally opposite of given position.
 *
 * @param {PositionString} position
 * @returns {PositionString} horizontally inverted position string
 */
export function invertPositionHorizontally (position) {
    let { mainAxis, xAlign, yAlign } = getAlignment(position);
    let newXAlign = OPPOSITE_ALIGNMENTS[xAlign];
    return mainAxis === 'x' ? `${newXAlign}-${yAlign}` : `${yAlign}-${newXAlign}`;
}

/**
 * Calculates position string that is vertically opposite of given position.
 *
 * @param {PositionString} position
 * @returns {PositionString} vertically inverted position string
 */
export function invertPositionVertically (position) {
    let { mainAxis, xAlign, yAlign } = getAlignment(position);
    let newYAlign = OPPOSITE_ALIGNMENTS[yAlign];
    return mainAxis === 'x' ? `${xAlign}-${newYAlign}` : `${newYAlign}-${xAlign}`;
}

/**
 * Normalize user-configured position to "{mainAlign}-{crossAlign}" format.
 *
 * - "top" -> "top-center"
 * - "right" -> "right-middle"
 * - "center" -> "center-middle"
 * - etc.
 *
 * @param {PositionString} position
 * @returns {PositionString}
 */
export function normalizePosition (position) {
    let { crossAlign, mainAlign } = getAlignment(position);
    return `${mainAlign}-${crossAlign}`;
}

/**
 * @param {PositionString} position
 * @param {PredicateCollisions} collides
 */
export function optimizePositionForCollisions (position, collides) {
    let { xAlign, yAlign } = getAlignment(position);

    // ----- COLLIDE WITH TOP EDGE -----
    // CHANGE
    // - 'top-*'            -> 'bottom-*'
    // - '(left|right)-top' -> '(left|right)-bottom'
    // - '(left|right)-end' -> '(left|right)-start'
    //
    // IGNORE
    // - 'bottom-*'
    // - '{H}-bottom'
    // - '{H}-start'
    // - '{H}-middle'
    if (collides.top && yAlign.match(/top|end/)) {
        position = invertPositionVertically(position);
    }

    // ----- COLLIDE WITH BOTTOM EDGE -----
    // CHANGE
    // - 'bottom-*'            -> 'top-*'
    // - '(left|right)-bottom' -> '(left|right)-top'
    // - '(left|right)-start'  -> '(left|right)-end'
    //
    // IGNORE
    // - 'top-*'
    // - '{H}-top'
    // - '{H}-middle'
    // - '{H}-end'
    if (collides.bottom && yAlign.match(/bottom|start/)) {
        position = invertPositionVertically(position);
    }

    // ----- COLLIDE WITH LEFT EDGE -----
    // CHANGE
    // - 'left-*'            -> 'right-*'
    // - '(top|bottom)-left' -> '(top|bottom)-right'
    // - '(top|bottom)-end'  -> '(top|bottom)-start'
    //
    // IGNORE
    // - 'right-*'
    // - '{V}-right'
    // - '{V}-start'
    // - '{V}-center'
    if (collides.left && xAlign.match(/left|end/)) {
        position = invertPositionHorizontally(position);
    }

    // ----- COLLIDE WITH RIGHT EDGE -----
    // CHANGE
    // - 'right-*'            -> 'left-*'
    // - '(top|bottom)-right' -> '(top|bottom)-left'
    // - '(top|bottom)-start' -> '(top|bottom)-end'
    //
    // IGNORE
    // - 'left-*'
    // - '(top|bottom)-left'
    // - '(top|bottom)-center'
    // - '(top|bottom)-end'
    if (collides.right && xAlign.match(/right|start/)) {
        position = invertPositionHorizontally(position);
    }

    // TODO: What if both sides of an axis collide?
    // e.g., both left/right or top/bottom collide

    return position;
}

export default {
    getAlignment,
    getCrossAxis,
    getHorizontalAlignment,
    getMainAxis,
    getVerticalAlignment,
    invertPositionHorizontally,
    invertPositionVertically,
    normalizePosition,
    optimizePositionForCollisions,
};
