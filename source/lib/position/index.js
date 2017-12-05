import { yOffsetFnMap, xOffsetFnMap } from './offsetFunctions';

/**
 * Calculate the top, right, bottom, and left x/y values of
 * an element at given coordinates.
 *
 * @function
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
 * @function
 * @param {String} position - the position of the offset element
 * @param {HTMLElement} offsetElement - the element to calculate (x,y) coordinates
 * @param {HTMLElement} referenceElement - the element that is being offset from
 *
 * @returns {Object} absolute (x,y) coordinates and metadata to position offsetElement
 * in relation to referenceElement
 */
function _getCoords (position, offsetElement, referenceElement) {
    // The 'position' property is added to provide information about final
    // calculated position of offset element in relation to reference element
    let coords = {
        x: 0,
        y: 0,
        position,
    };
    let offRect = offsetElement.getBoundingClientRect();
    let refRect = referenceElement.getBoundingClientRect();

    coords.x = xOffsetFnMap[position](offRect, refRect);
    coords.x += window.pageXOffset;

    coords.y = yOffsetFnMap[position](offRect, refRect);
    coords.y += window.pageYOffset;

    return coords;
}

/**
 * Determine if any side of an element is obscured by the viewport.
 *
 * @function
 * @argument {HTMLElement} element - the element to check against the viewport
 * @argument {Object} coords - (x,y) coordinates
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
 * @function
 * @param {String} position - the current position
 * @param {Object} offscreen - offscreen metadata
 * @returns {String} corrected position
 */
function _repositionTowardCenter (position, offscreen) {
    let vShiftMap = {
        'top': 'bottom',
        'top-right': 'bottom-right',
        'top-left': 'bottom-left',
        'right': 'right',
        'right-top': 'right-bottom',
        'right-bottom': 'right-top',
        'bottom': 'top',
        'bottom-right': 'top-right',
        'bottom-left': 'top-left',
        'left': 'left',
        'left-top': 'left-bottom',
        'left-bottom': 'left-top',
    };

    let hShiftMap = {
        'top': 'top',
        'top-right': 'top-left',
        'top-left': 'top-right',
        'right': 'left',
        'right-top': 'left-top',
        'right-bottom': 'left-bottom',
        'bottom': 'bottom',
        'bottom-right': 'bottom-left',
        'bottom-left': 'bottom-right',
        'left': 'right',
        'left-top': 'right-top',
        'left-bottom': 'right-bottom',
    };

    if (offscreen.vertically) {
        position = vShiftMap[position];
    }

    if (offscreen.horizontally) {
        position = hShiftMap[position];
    }

    return position;
}

/**
 * Calculate coordinates of an element in relation to a reference element
 * while attempting to keep the element visible in the viewport.
 *
 * @function
 * @param {Element} offsetElement element to position
 * @param {Element} referenceElement
 * reference element used to calculate position of offsetElement
 * @param {String} [position='bottom-right']
 * position of offsetElement in relation to referenceElement
 *
 * @returns {Object} (x,y) coordinates
 */
export function getPosition (offsetElement, referenceElement, position = 'bottom-right') {
    let coords = _getCoords(position, offsetElement, referenceElement);
    let isOffscreen = _getOffscreenMetadata(offsetElement, coords);

    if (isOffscreen.anywhere) {
        let newPosition = _repositionTowardCenter(position, isOffscreen);
        let newCoords = _getCoords(newPosition, offsetElement, referenceElement);

        //If the repositioned element is no longer offscreen,
        //use the respositioned element coordinates
        isOffscreen = _getOffscreenMetadata(offsetElement, newCoords);
        if (!isOffscreen.anywhere) {
            coords = newCoords;
        }
    }

    return coords;
}
