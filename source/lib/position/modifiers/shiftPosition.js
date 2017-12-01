import { getShiftMap } from '../utils';

/**
 * @function
 * @argument {ORIENTATION} orientation - the current orientation
 * @argument {POSITION} position - the current position
 * @returns {POSITION} the newly shifted position
 */
export default function shiftPosition (orientation, position) {
    return getShiftMap[orientation][position];
}
