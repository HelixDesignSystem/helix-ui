import getOffsetEquationMap from './getOffsetEquationMap';

/**
 * @function
 * @argument {POSITION} position - the position of the offset element
 * @argument {Element} offsetElement - the element to calculate offsets for
 * @argument {Element} targetElement - the element that is being offset from
 * @returns {Object} the offsets object, containing position
 */
export default function getOffsetsObject (position, offsetElement, targetElement) {
    let offsets = {
        position: position,
        y: 0,
        x: 0,
    };

    let offsetElementRect = offsetElement.getBoundingClientRect();
    let targetElementRect = targetElement.getBoundingClientRect();

    offsets.y = calculateYOffset(position, offsetElementRect, targetElementRect);
    offsets.x = calculateXOffset(position, offsetElementRect, targetElementRect);
    offsets.y += window.pageYOffset;
    offsets.x += window.pageXOffset;

    return offsets;
}

function calculateYOffset (position, offsetElementRect, targetElementRect) {
    return getOffsetEquationMap[position].y(offsetElementRect, targetElementRect);
}

function calculateXOffset (position, offsetElementRect, targetElementRect) {
    return getOffsetEquationMap[position].x(offsetElementRect, targetElementRect);
}

