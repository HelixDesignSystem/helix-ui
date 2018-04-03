'use strict';

/*
 * Tasks in this file handle copying files or directories to public/
 */

const CONFIG = require('../_config');
const { ensureDir, copy } = require('fs-extra');

async function copyDist () {
    let sourcePath = `${CONFIG.root}/${CONFIG.distDir}`;
    let destPath = `${CONFIG.publicDir}/dist`;

    console.log(`Copying compiled assets to ${destPath}`);

    await ensureDir(`${destPath}`);
    await copy(sourcePath, destPath);
}//copyDist()

async function copyDocs () {
    console.log('Copying static files for docs');
    // Directories to copy from docs/ to public/
    let dirs = [
        'images',
        'vendor',
    ];

    await ensureDir(`${CONFIG.publicDir}`);

    dirs.forEach(srcDir => {
        let sourcePath = `${CONFIG.docsDir}/${srcDir}`;
        let destPath = `${CONFIG.publicDir}/${srcDir}`;
        copy(sourcePath, destPath);
    });
}//copyDocs();

exports.copyDist = copyDist;
exports.copyDocs = copyDocs;
