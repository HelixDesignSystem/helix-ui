#!/usr/bin/env node
'use strict';

const CONFIG = require('../_config');
const fsx = require('fs-extra');

function cleanSync () {
    fsx.removeSync(CONFIG.publicDir);
}

exports.cleanSync = cleanSync;

if (require.main === module) {
    cleanSync();
}
