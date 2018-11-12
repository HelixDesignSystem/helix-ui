#!/usr/bin/env node

const { buildAll } = require('./_build');

(async function () {
    await buildAll();
})();
