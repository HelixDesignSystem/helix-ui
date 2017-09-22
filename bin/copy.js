#!/usr/bin/env node
'use strict';

const CONFIG = require('../_config');
const fsx = require('fs-extra');

function copySync () {
    CONFIG.copy.dirs.forEach(srcDir => {
        let sourcePath = `${CONFIG.sourceDir}/${srcDir}`;
        let destPath = `${CONFIG.publicDir}/${srcDir}`;
        // TODO: only copy if sourcePath exists
        fsx.copySync(sourcePath, destPath);
    });
}

exports.copySync = copySync;

if (require.main === module) {
    copySync();
}
