import { POSITION } from './constants';
import { getNewPosition } from './modifiers';
import { getOffsetsObject, getOffScreenValidationObject } from './utils';

/**
 * @function
 * @argument {Element} offsetElement - the element to get offsets for
 * @argument {Element} targetElement - the element that is being offset from
 * @argument {POSITION} position - (Optional) the position of the offset element
 * @returns {Object} the offsets object, containing position
 */
export default function getOffsets (offsetElement, targetElement, position = POSITION.BOTTOM_RIGHT) {
    let offsets = getOffsetsObject(position, offsetElement, targetElement);
    let offscreen = getOffScreenValidationObject(offsetElement, offsets);

    //If the element is offscreen, getNewPosition the element
    if (offscreen.anywhere) {
        let newPosition = getNewPosition(position, offscreen);
        let newOffsets = getOffsetsObject(newPosition, offsetElement, targetElement);

        //If the getNewPosition element is no longer offscreen,
        //use the new getNewPosition element offsets
        offscreen = getOffScreenValidationObject(offsetElement, newOffsets);
        if (!offscreen.anywhere) {
            offsets = newOffsets;
        }
    }

    return offsets;
}
