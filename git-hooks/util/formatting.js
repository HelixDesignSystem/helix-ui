// See http://bit.ly/2ORJ0x2 (\x1b sequence)
// See http://bit.ly/2psMdZ4 (additional sequences)
const FORMAT = {
    bg: {
        black: '\x1b[40m',
        blue: '\x1b[44m',
        cyan: '\x1b[46m',
        green: '\x1b[42m',
        magenta: '\x1b[45m',
        red: '\x1b[41m',
        white: '\x1b[47m',
        yellow: '\x1b[43m',
    },
    fg: {
        black: '\x1b[30m',
        blue: '\x1b[34m',
        cyan: '\x1b[36m',
        gray: '\x1b[90m',
        green: '\x1b[32m',
        magenta: '\x1b[35m',
        red: '\x1b[31m',
        white: '\x1b[37m',
        yellow: '\x1b[33m',
    },
    blink: '\x1b[5m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    hidden: '\x1b[8m',
    invert: '\x1b[7m',
    italic: '\x1b[3m',
    reset: '\x1b[0m',
    strike: '\x1b[9m',
    underline: '\x1b[4m',
};

/**
 * Define a custom formatting function to apply to a string.
 *
 * @param object cfg - see FORMAT for valid props
 * @returns function - returns a function that accepts a string to apply formatting
 *      obj -> string -> string
 *      obj => { string => string }
 */
const format = (cfg={}) => (txt='') => {
    // break down configuration into array of [key, value] items
    let cfgEntries = Object.entries(cfg);
    let { reset, fg, bg } = FORMAT;

    // reduce configuration into a single string of formating escape sequences
    let fmtSeq = cfgEntries.reduce( (seq, entry) => {
        let [ key, val ] = entry;
        let _fmt = '';

        // get format escape sequence for entry
        switch (key) {
            case 'fg':
                _fmt = fg[val] || fg['white'];
                break;
            case 'bg':
                _fmt = bg[val] || bg['black'];
                break;
            default:
                // only add format to sequence if opt is true
                if (!!val) {
                    _fmt = FORMAT[key] || '';
                }
                break;
        }

        // append escape sequence to list of all sequences
        return `${seq}${_fmt}`;
    }, '');

    // wrap text in formatting and reset escape sequences
    return `${fmtSeq}${txt}${reset}`;
};

module.exports = {
    format
};
