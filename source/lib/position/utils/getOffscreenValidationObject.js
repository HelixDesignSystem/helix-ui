/**
 * @function
 * @argument {Element} element - the element to check if offscreen
 * @argument {Object} offsets - the offsets object
 * @returns {Object} the offscreen validation object, with Boolean values
 */
export default function getOffScreenValidationObject (element, offsets) {
    let obj = {};

    obj.top = (offsets.y < window.pageYOffset);
    obj.right = (offsets.x + element.getBoundingClientRect().width > window.innerWidth + window.pageXOffset);
    obj.left = (offsets.x < window.pageXOffset);
    obj.bottom = (offsets.y + element.getBoundingClientRect().height > window.innerHeight + window.pageYOffset);
    obj.anywhere = (obj.top || obj.right || obj.bottom || obj.left);

    return obj;
}
