#!/usr/bin/env node
'use strict';

const  { publishDocs } = require('../lib/publish');

(async function () {
    await publishDocs();
})();
