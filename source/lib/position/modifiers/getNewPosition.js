import { ORIENTATION } from '../constants';
import shiftPosition from './shiftPosition';

/**
 * @function
 * @argument {POSITION} position - the current position
 * @argument {Object} offscreen - the offscreen validation object
 * @returns {POSITION} the new position
 */
export default function getNewPosition (position, offscreen) {
    if (offscreen.top || offscreen.bottom) {
        position = shiftPosition(ORIENTATION.VERTICAL, position);
    }

    if (offscreen.left || offscreen.right) {
        position = shiftPosition(ORIENTATION.HORIZONTAL, position);
    }

    return position;
}
