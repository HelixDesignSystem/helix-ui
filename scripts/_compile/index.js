'use strict';

/*
 * Tasks in this file handle compiling distributable assets
 * from src/* to dist/*
 */
const CleanCSS = require('clean-css');
const LESS = require('less');
const path = require('path');
const { ensureDir } = require('fs-extra');

const CONFIG = require('../_config');
const { exec, readFile, writeFile } = require('../_util');

// See http://lesscss.org/usage/#programmatic-usage
async function compileStyles () {
    console.log('SRC: Compiling CSS');

    let cfg = {
        entry: `${CONFIG.sourceDir}/_bundle.less`,
        dest: `${CONFIG.distDir}/styles`,
    };
    let devFile = `${cfg.dest}/helix-ui.css`;
    let minFile = `${cfg.dest}/helix-ui.min.css`;

    let srcContent = await readFile(cfg.entry, 'utf-8');

    let output = '';
    try {
        output = await LESS.render(srcContent, {
            paths: CONFIG.less.paths.map((filepath) => {
                return path.join(CONFIG.root, filepath);
            }),
            filename: path.basename(cfg.entry),
            rewriteUrls: true,
        });
    } catch (err) {
        console.log(`[COMPILE:Styles] Error: ${err.message}`);
        console.log('[COMPILE:Styles] skipping CSS compilation')
        return;
    }

    let minified = new CleanCSS({
        advanced: true,
    }).minify(output.css);

    await ensureDir(cfg.dest);
    await writeFile(devFile, output.css);
    await writeFile(minFile, minified.styles);
}//compileStyles()

async function compileScripts () {
    console.log('SRC: Compiling JavaScript');

    // TODO: convert to npm script
    await exec(`yarn rollup`, { cwd: CONFIG.root }, function(error, stderr){
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stderr: ${stderr}`);
    });
}//compileScripts()

async function compileAll () {
    await ensureDir(CONFIG.distDir);
    await compileStyles();
    await compileScripts();
}//compileSrc()

exports.compileAll = compileAll;
exports.compileScripts = compileScripts;
exports.compileStyles = compileStyles;
