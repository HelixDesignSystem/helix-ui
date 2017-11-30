import { POSITIONS } from './constants'
import { getNewPosition } from './getNewPosition';
import { getOffScreenValidationObject } from './getOffScreenValidationObject';
import { calculateOffsetValues } from './calculateOffsetValues';

function getOffsetValues (offsetElement, targetElement, position = POSITIONS.BOTTOM_RIGHT) {
    let offsetElementRect = offsetElement.getBoundingClientRect();
    let targetElementRect = targetElement.getBoundingClientRect();
    let offsets = calculateOffsetValues(position, offsetElementRect, targetElementRect);

    if (isElementOffscreen(offsetElementRect, offsets)) {
        let newPosition = getNewPosition(position, offsetElementRect, offsets);
        let newOffsets = calculateOffsetValues(newPosition, offsetElementRect, targetElementRect);

        if (!isElementOffscreen(offsetElementRect, newOffsets)) {
            offsets = newOffsets;
        }
    }

    return offsets;
}

function isElementOffscreen (offsetElementRect, offsets) {
    let offscreen = getOffScreenValidationObject(offsetElementRect, offsets);
    return (offscreen.top || offscreen.right || offscreen.bottom || offscreen.left);
}

export { getOffsetValues }
