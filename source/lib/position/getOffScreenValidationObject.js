function getOffScreenValidationObject (elementRect, offsets) {
    var offscreen = {};

    offscreen.top = (offsets.y < window.pageYOffset);
    offscreen.right = (offsets.x + elementRect.width > window.innerWidth + window.pageXOffset);
    offscreen.left = (offsets.x < window.pageXOffset);
    offscreen.bottom = (offsets.y + elementRect.height > window.innerHeight + window.pageYOffset);

    return offscreen;
}

export { getOffScreenValidationObject };
