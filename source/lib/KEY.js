const KEYCODE = {
    Alt: 18,
    Backspace: 8,
    Control: 17,
    Delete: 46,
    Down: 40,
    End: 35,
    Enter: 13,
    Escape: 27,
    Home: 36,
    Insert: 45,
    Left: 37,
    PageDown: 34,
    PageUp: 33,
    Right: 39,
    Shift: 16,
    Space: 32,
    Tab: 9,
    Up: 38
};

// ALIASES
KEYCODE['Ctrl'] = KEYCODE['Control'];
KEYCODE['Del'] = KEYCODE['Delete'];
KEYCODE['Esc'] = KEYCODE['Escape'];
KEYCODE['Ins'] = KEYCODE['Insert'];
KEYCODE['Option'] = KEYCODE['Alt'];
KEYCODE['PgDown'] = KEYCODE['PageDown'];
KEYCODE['PgUp'] = KEYCODE['PageUp'];
KEYCODE['Return'] = KEYCODE['Enter'];

module.exports = KEYCODE;
