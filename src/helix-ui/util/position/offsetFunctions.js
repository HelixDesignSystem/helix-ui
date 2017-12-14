export function getCenter (off, ref) {
    let x = ref.left + (ref.width / 2) - (off.width / 2);
    let y = ref.top + (ref.height / 2) - (off.height / 2);
    return [ x, y ];
}

export function getTop (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top - off.height;
    y -= config.margin;
    return [ x, y ];
}

export function getBottom (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    y = ref.top + ref.height;
    y += config.margin;
    return [ x, y ];
}

export function getLeft (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left - off.width - config.margin;
    return [ x, y ];
}

export function getRight (off, ref, config) {
    let [ x, y ] = getCenter(off, ref);
    x = ref.left + ref.width + config.margin;
    return [ x, y ];
}

export function getTopLeft (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

export function getTopStart (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

export function getTopEnd (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

export function getTopRight (off, ref, config) {
    let [ x, y ] = getTop(off, ref, config);
    x -= (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

export function getRightTop (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y -= (ref.height / 2);
    y += config.offset;
    return [ x, y ];
}

export function getRightStart (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

export function getRightEnd (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

export function getRightBottom (off, ref, config) {
    let [ x, y ] = getRight(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

export function getBottomRight (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x += (off.width / 2);
    x -= config.offset;
    return [ x, y ];
}

export function getBottomEnd (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.right - off.width;
    x -= config.offset;
    return [ x, y ];
}

export function getBottomStart (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x = ref.left;
    x += config.offset;
    return [ x, y ];
}

export function getBottomLeft (off, ref, config) {
    let [ x, y ] = getBottom(off, ref, config);
    x -= (off.width / 2);
    x += config.offset;
    return [ x, y ];
}

export function getLeftBottom (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y += off.height / 2;
    y -= config.offset;
    return [ x, y ];
}

export function getLeftEnd (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.bottom - off.height;
    y -= config.offset;
    return [ x, y ];
}

export function getLeftStart (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y = ref.top;
    y += config.offset;
    return [ x, y ];
}

export function getLeftTop (off, ref, config) {
    let [ x, y ] = getLeft(off, ref, config);
    y -= (ref.height / 2); 
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
