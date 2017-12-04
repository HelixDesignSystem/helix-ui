import { POSITIONS } from './constants';
import { getOffScreenValidationObject } from './getOffScreenValidationObject';

function getNewPosition (position, offsetElementRect, offsets) {
    let newPosition = position;
    let offscreen = getOffScreenValidationObject(offsetElementRect, offsets);

    if (offscreen.top || offscreen.bottom) {
        newPosition = shiftPositionVertically(newPosition);
    }

    if (offscreen.left || offscreen.right) {
        newPosition = shiftPositionHorizontally(newPosition);
    }

    return newPosition;
}

/* TODO: refactor */
/*eslint complexity: 0*/

function shiftPositionVertically (position) {
    switch (position) {
        case POSITIONS.TOP:
            return POSITIONS.BOTTOM;
        case POSITIONS.TOP_RIGHT:
            return POSITIONS.BOTTOM_RIGHT;
        case POSITIONS.TOP_LEFT:
            return POSITIONS.BOTTOM_LEFT;
        case POSITIONS.RIGHT_TOP:
            return POSITIONS.RIGHT_BOTTOM;
        case POSITIONS.LEFT_TOP:
            return POSITIONS.LEFT_BOTTOM;
        case POSITIONS.BOTTOM:
            return POSITIONS.TOP;
        case POSITIONS.BOTTOM_RIGHT:
            return POSITIONS.TOP_RIGHT;
        case POSITIONS.BOTTOM_LEFT:
            return  POSITIONS.TOP_LEFT;
        case POSITIONS.RIGHT_BOTTOM:
            return POSITIONS.RIGHT_TOP;
        case POSITIONS.LEFT_BOTTOM:
            return  POSITIONS.LEFT_TOP;
    }
}

function shiftPositionHorizontally (position) {
    switch (position) {
        case POSITIONS.LEFT:
            return POSITIONS.RIGHT;
        case POSITIONS.TOP_LEFT:
            return POSITIONS.TOP_RIGHT;
        case POSITIONS.BOTTOM_LEFT:
            return POSITIONS.BOTTOM_RIGHT;
        case POSITIONS.LEFT_TOP:
            return POSITIONS.RIGHT_TOP;
        case POSITIONS.LEFT_BOTTOM:
            return POSITIONS.RIGHT_BOTTOM;
        case POSITIONS.RIGHT:
            return POSITIONS.LEFT;
        case POSITIONS.TOP_RIGHT:
            return POSITIONS.TOP_LEFT;
        case POSITIONS.BOTTOM_RIGHT:
            return POSITIONS.BOTTOM_LEFT;
        case POSITIONS.RIGHT_TOP:
            return POSITIONS.LEFT_TOP;
        case POSITIONS.RIGHT_BOTTOM:
            return POSITIONS.LEFT_BOTTOM;
    }
}

export { getNewPosition };
