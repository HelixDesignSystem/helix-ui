#!/usr/bin/env node
'use strict';

const { publishDocs } = require('./_publish/publishDocs');

(async function () {
    await publishDocs();
})();
