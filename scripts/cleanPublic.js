#!/usr/bin/env node
'use strict';

// TODO: migrate to scripts/clean.js

const { remove } = require('fs-extra');

const CONFIG = require('./_config');

(async function () {
    await remove(CONFIG.publicDir);
})();
