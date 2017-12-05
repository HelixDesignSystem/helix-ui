import { ARROW, POSITION } from '../constants';

/**
 * @exports {Object} the map of functions to calculate offsets for any position
 */
export default {
    [POSITION.TOP]: {
        'y': topVertical,
        'x': middleVertical,
    },
    [POSITION.BOTTOM]: {
        'y': bottomVertical,
        'x': middleVertical,
    },
    [POSITION.RIGHT]: {
        'y': middleHorizontal,
        'x': rightHorizontal,
    },
    [POSITION.LEFT]: {
        'y': middleHorizontal,
        'x': leftHorizontal,
    },
    [POSITION.TOP_RIGHT]: {
        'y': topVertical,
        'x': rightVertical,
    },
    [POSITION.TOP_LEFT]: {
        'y': topVertical,
        'x': leftVertical,
    },
    [POSITION.BOTTOM_RIGHT]: {
        'y': bottomVertical,
        'x': rightVertical,
    },
    [POSITION.BOTTOM_LEFT]: {
        'y': bottomVertical,
        'x': leftVertical,
    },
    [POSITION.RIGHT_TOP]: {
        'y': topHorizontal,
        'x': rightHorizontal,
    },
    [POSITION.RIGHT_BOTTOM]: {
        'y': bottomHorizontal,
        'x': rightHorizontal,
    },
    [POSITION.LEFT_TOP]: {
        'y': topHorizontal,
        'x': leftHorizontal,
    },
    [POSITION.LEFT_BOTTOM]: {
        'y': bottomHorizontal,
        'x': leftHorizontal,
    },
}

function middleVertical (offsetElementRect, targetElementRect) {
    return targetElementRect.left +
        (targetElementRect.width / 2) -
        (offsetElementRect.width / 2);
}

function middleHorizontal (offsetElementRect, targetElementRect) {
    return targetElementRect.top +
        (targetElementRect.height / 2) -
        (offsetElementRect.height / 2);
}

function topVertical (offsetElementRect, targetElementRect) {
    return targetElementRect.top -
        offsetElementRect.height -
        ARROW.HEIGHT;
}

function topHorizontal (offsetElementRect, targetElementRect) {
    return targetElementRect.top +
        (targetElementRect.height / 2) -
        offsetElementRect.height +
        (ARROW.WIDTH / 2) +
        ARROW.OFFSET;
}

function bottomVertical (offsetElementRect, targetElementRect) {
    return targetElementRect.top +
        targetElementRect.height +
        ARROW.HEIGHT;
}

function bottomHorizontal (offsetElementRect, targetElementRect) {
    return targetElementRect.top +
        (targetElementRect.height / 2) -
        (ARROW.WIDTH / 2) -
        ARROW.OFFSET;
}

function rightVertical (offsetElementRect, targetElementRect) {
    return targetElementRect.left +
        (targetElementRect.width / 2) -
        (ARROW.WIDTH / 2) -
        ARROW.OFFSET;
}

function leftVertical (offsetElementRect, targetElementRect) {
    return targetElementRect.left +
        (targetElementRect.width / 2) -
        offsetElementRect.width +
        (ARROW.WIDTH / 2) +
        ARROW.OFFSET;
}

function rightHorizontal (offsetElementRect, targetElementRect) {
    return targetElementRect.left +
        targetElementRect.width +
        ARROW.HEIGHT;
}

function leftHorizontal (offsetElementRect, targetElementRect) {
    return targetElementRect.left -
        offsetElementRect.width -
        ARROW.HEIGHT;
}

