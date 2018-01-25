#!/usr/bin/env node
'use strict';

const CONFIG = require('../_config');
const { remove } = require('fs-extra');

(async function () {
    await remove(CONFIG.publicDir);
})();
