#!/usr/bin/env node

const { buildTemplates } = require('./_build/templates');

(async function () {
    await buildTemplates();
})();
