function getCenter (off, ref) {
    let x = ref.left + (ref.width / 2) - (off.width / 2);
    let y = ref.top + (ref.height / 2) - (off.height / 2);
    return [ x, y ];
}

function getTop (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top - off.height;
    y -= config.margin;
    return [ x, y ];
}

function getBottom (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top + ref.height;
    y += config.margin;
    return [ x, y ];
}

function getLeft (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left - off.width - config.margin;
    return [ x, y ];
}

function getRight (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left + ref.width + config.margin;
    return [ x, y ];
}

function getTopLeft (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

function getTopStart (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

function getTopEnd (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

function getTopRight (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x += (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

function getRightTop (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y -= (off.height / 2);
    y += config.offset;
    return [ x, y ];
}

function getRightStart (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

function getRightEnd (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

function getRightBottom (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

function getBottomRight (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x += (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

function getBottomEnd (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

function getBottomStart (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

function getBottomLeft (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

function getLeftBottom (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

function getLeftEnd (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

function getLeftStart (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

function getLeftTop (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y -= (off.height / 2);
    y += config.offset;
    return [ x, y ];
}

const offsetFunctions = {
    'top-left': getTopLeft,
    'top-start': getTopStart,
    'top': getTop,
    'top-end': getTopEnd,
    'top-right': getTopRight,
    'right-top': getRightTop,
    'right-start': getRightStart,
    'right': getRight,
    'right-end': getRightEnd,
    'right-bottom': getRightBottom,
    'bottom-right': getBottomRight,
    'bottom-end': getBottomEnd,
    'bottom': getBottom,
    'bottom-start': getBottomStart,
    'bottom-left': getBottomLeft,
    'left-bottom': getLeftBottom,
    'left-end': getLeftEnd,
    'left': getLeft,
    'left-start': getLeftStart,
    'left-top': getLeftTop,
    'center': getCenter,
};

export default offsetFunctions;
