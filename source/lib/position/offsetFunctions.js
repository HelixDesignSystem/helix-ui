let _arrow = {
    width: 16,
    height: 12,
    margin: 12,
};

/* ========== VERTICAL ========== */
function _yMiddle (offsetElementRect, refElementRect) {
    return refElementRect.left +
        (refElementRect.width / 2) -
        (offsetElementRect.width / 2);
}

function _yTop (offsetElementRect, refElementRect) {
    return refElementRect.top -
        offsetElementRect.height -
        _arrow.height;
}

function _yBottom (offsetElementRect, refElementRect) {
    return refElementRect.top +
        refElementRect.height +
        _arrow.height;
}

function _yRight (offsetElementRect, refElementRect) {
    return refElementRect.left +
        (refElementRect.width / 2) -
        (_arrow.width / 2) -
        _arrow.margin;
}

function _yLeft (offsetElementRect, refElementRect) {
    return refElementRect.left +
        (refElementRect.width / 2) -
        offsetElementRect.width +
        (_arrow.width / 2) +
        _arrow.margin;
}

/* ========== HORIZONTAL ========== */
function _xMiddle (offsetElementRect, refElementRect) {
    return refElementRect.top +
        (refElementRect.height / 2) -
        (offsetElementRect.height / 2);
}

function _xTop (offsetElementRect, refElementRect) {
    return refElementRect.top +
        (refElementRect.height / 2) -
        offsetElementRect.height +
        (_arrow.width / 2) +
        _arrow.margin;
}

function _xBottom (offsetElementRect, refElementRect) {
    return refElementRect.top +
        (refElementRect.height / 2) -
        (_arrow.width / 2) -
        _arrow.margin;
}

function _xRight (offsetElementRect, refElementRect) {
    return refElementRect.left +
        refElementRect.width +
        _arrow.height;
}

function _xLeft (offsetElementRect, refElementRect) {
    return refElementRect.left -
        offsetElementRect.width -
        _arrow.height;
}

/* ========== EXPORTS ========== */
export const yOffsetFnMap = {
    'top': _yTop,
    'bottom': _yBottom,
    'right': _xMiddle,
    'left': _xMiddle,
    'top-right': _yTop,
    'top-left': _yTop,
    'bottom-right': _yBottom,
    'bottom-left': _yBottom,
    'right-top': _xTop,
    'right-bottom': _xBottom,
    'left-top': _xTop,
    'left-bottom': _xBottom,
};

export const xOffsetFnMap = {
    'top': _yMiddle,
    'bottom': _yMiddle,
    'right': _xRight,
    'left': _xLeft,
    'top-right': _yRight,
    'top-left': _yLeft,
    'bottom-right': _yRight,
    'bottom-left': _yLeft,
    'right-top': _xRight,
    'right-bottom': _xRight,
    'left-top': _xLeft,
    'left-bottom': _xLeft,
};
