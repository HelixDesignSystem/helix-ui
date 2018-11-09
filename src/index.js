// package.main (CJS) loads package.module (ESM)
require = require('esm')(module); /* eslint-disable-line no-global-assign */
module.exports = require('./helix-ui.js');
