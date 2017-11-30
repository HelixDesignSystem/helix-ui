/* TODO: refactor */
/*eslint complexity: 0*/

import { ARROW, POSITIONS } from './constants'

function calculateOffsetValues (position, offsetElementRect, targetElementRect) {
    var offsets = {
        position: position,
        y: 0,
        x: 0,
    }

    switch (position) {
        case POSITIONS.TOP:
            offsets.y = targetElementRect.top - ARROW.HEIGHT - offsetElementRect.height;
            offsets.x = targetElementRect.left + (targetElementRect.width / 2) - 
            (ARROW.WIDTH / 2) - (offsetElementRect.width / 2);
            break;
        case POSITIONS.BOTTOM:
            offsets.y = targetElementRect.top + targetElementRect.height + ARROW.HEIGHT;
            offsets.x = targetElementRect.left + (targetElementRect.width / 2) - 
            (ARROW.WIDTH / 2) - (offsetElementRect.width / 2);
            break;
        case POSITIONS.RIGHT:
            offsets.y = targetElementRect.top + (targetElementRect.height / 2) + 
            (ARROW.WIDTH / 2) - (offsetElementRect.height / 2);
            offsets.x = targetElementRect.left + targetElementRect.width + ARROW.HEIGHT;
            break;
        case POSITIONS.LEFT:
            offsets.y = targetElementRect.top + (targetElementRect.height / 2) + 
            (ARROW.WIDTH / 2) - (offsetElementRect.height / 2);
            offsets.x = targetElementRect.left - ARROW.HEIGHT - offsetElementRect.width;
            break;
        case POSITIONS.TOP_RIGHT:
            offsets.y = targetElementRect.top - ARROW.HEIGHT - offsetElementRect.height;
            offsets.x = targetElementRect.left + (targetElementRect.width / 2) - ARROW.OFFSET - (ARROW.WIDTH / 2);
            break;
        case POSITIONS.TOP_LEFT:
            offsets.y = targetElementRect.top - ARROW.HEIGHT - offsetElementRect.height;
            offsets.x = targetElementRect.left + (targetElementRect.width / 2) + 
            ARROW.OFFSET + (ARROW.WIDTH / 2) - offsetElementRect.width;
            break;
        case POSITIONS.BOTTOM_RIGHT:
            offsets.y = targetElementRect.top + targetElementRect.height + ARROW.HEIGHT;
            offsets.x = targetElementRect.left + (targetElementRect.width / 2) - ARROW.OFFSET - (ARROW.WIDTH / 2);
            break;
        case POSITIONS.BOTTOM_LEFT:
            offsets.y = targetElementRect.top + targetElementRect.height + ARROW.HEIGHT;
            offsets.x = targetElementRect.left + (targetElementRect.width / 2) + 
            ARROW.OFFSET + (ARROW.WIDTH / 2) - offsetElementRect.width;
            break;
        case POSITIONS.RIGHT_TOP:
            offsets.y = targetElementRect.top + (targetElementRect.height / 2) + 
            ARROW.OFFSET + (ARROW.WIDTH / 2) - offsetElementRect.height;
            offsets.x = targetElementRect.left + targetElementRect.width + ARROW.HEIGHT;
            break;
        case POSITIONS.RIGHT_BOTTOM:
            offsets.y = targetElementRect.top + (targetElementRect.height / 2) - ARROW.OFFSET - (ARROW.WIDTH / 2);
            offsets.x = targetElementRect.left + targetElementRect.width + ARROW.HEIGHT;
            break;
        case POSITIONS.LEFT_TOP:
            offsets.y = targetElementRect.top + (targetElementRect.height / 2) + 
            ARROW.OFFSET + (ARROW.WIDTH / 2) - offsetElementRect.height;
            offsets.x = targetElementRect.left - ARROW.HEIGHT - offsetElementRect.width;
            break;
        case POSITIONS.LEFT_BOTTOM:
            offsets.y = targetElementRect.top + (targetElementRect.height / 2) - ARROW.OFFSET - (ARROW.WIDTH / 2);
            offsets.x = targetElementRect.left - ARROW.HEIGHT - offsetElementRect.width;
            break;
        default:
            throw new Error('"' + position + '" is not a valid position');
    }

    offsets.y += window.pageYOffset;
    offsets.x += window.pageXOffset;

    return offsets;
}

export { calculateOffsetValues }
