'use strict';

// See http://lesscss.org/usage/#programmatic-usage

const CONFIG = require('../_config');
const fs = require('fs');
const fsx = require('fs-extra');
const less = require('less');
const path = require('path');

const _lessConfig = CONFIG.less;

function _buildCssPath (srcPath) {
    const srcDir = path.dirname(srcPath);

    /* FOO/a/b/c/ => BAR/a/b/c/ */
    const destDir = srcDir.replace(CONFIG.sourceDir, CONFIG.publicDir);

    /* file name (without extension) */
    const baseName = path.basename(srcPath, path.extname(srcPath));

    return `${destDir}/${baseName}.css`;
}//_buildCssPath()

// Reference paths to include for @import
const _paths = _lessConfig.paths.map((filepath) => {
    return path.join(CONFIG.root, filepath);
});

// Array of src->dest path metadata
const _files = _lessConfig.files.map(srcPath => {
    return {
        src: srcPath,
        dest: _buildCssPath(srcPath)
    };
});

function compileSync () {
    _files.forEach(file => {
        function _success (output) {
            fsx.ensureDirSync(path.dirname(file.dest));

            fs.writeFile(file.dest, output.css, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`Generated: ${file.dest}`);
            });
        }//_success()

        function _error (err) {
            console.error(`ERROR: ${err}`);
        }

        fs.readFile(file.src, (err, data) => {
            if (err) {
                throw err;
            }

            less.render(data.toString(), {
                paths: _paths,
                filename: path.basename(file.src)
            }).then(_success, _error);
        });
    });
}//compileSync()

exports.compileSync = compileSync;
