'use strict';

/*
 * Tasks in this file handle compiling distributable assets
 * from src/* to dist/*
 */
const CleanCSS = require('clean-css');
const LESS = require('less');
const SASS = require('node-sass');
const path = require('path');
const { ensureDir } = require('fs-extra');

const CONFIG = require('../_config');
const { exec, readFile, writeFile } = require('../_util');

/**
 * Combine LESS-compiled CSS with SASS-compiled CSS
 */
async function compileStyles () {
    console.log('SRC: Compiling CSS');
    let outDir = `${CONFIG.distDir}/styles`;

    let scssData = await compileScss();
    let lessData = await compileLess();

    let combinedDevCss = scssData.css      + lessData.css;
    let combinedMinCss = scssData.minified + lessData.minified;

    await ensureDir(outDir);
    await writeFile(`${outDir}/helix-ui.css`, combinedDevCss);
    await writeFile(`${outDir}/helix-ui.min.css`, combinedMinCss);
    console.log('SRC: Compiling CSS [DONE]');
}

/**
 * @see http://lesscss.org/usage/#programmatic-usage
 * @returns {object}
 * metadata object with 'css' and 'minified' props whose
 * values are CSS stylesheet strings
 */
async function compileLess () {
    let inFile = `${CONFIG.sourceDir}/less/index.less`;

    let srcContent = await readFile(inFile, 'utf-8');

    let rendered = {};
    try {
        rendered = await LESS.render(srcContent, {
            paths: CONFIG.less.paths.map((filepath) => {
                return path.join(CONFIG.root, filepath);
            }),
            filename: path.basename(inFile),
            rewriteUrls: true,
        });
    } catch (err) {
        console.log(`[COMPILE:Styles] Error: ${err.message}`);
        console.log('[COMPILE:Styles] skipping CSS compilation')
        return;
    }

    let minified = new CleanCSS({
        advanced: true,
    }).minify(rendered.css);

    return {
        css: rendered.css,
        minified: minified.styles
    };
}

/**
 * @see https://sass-lang.com/documentation/js-api
 * @returns {object}
 * metadata object with 'css' and 'minified' props whose
 * values are CSS stylesheet strings
 */
async function compileScss () {
    // SASS -> CSS (full)
    let rendered = await SASS.renderSync({
        ...CONFIG.sass,
        file: `${CONFIG.sourceDir}/scss/index.scss`,
        outputStyle: 'expanded',
    });
    let css = rendered.css.toString();

    // CSS (full) -> CSS (minified)
    let minified = new CleanCSS({
        advanced: true,
    }).minify(css);

    return {
        css,
        minified: minified.styles,
    };
}

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
}

async function compileAll () {
    await ensureDir(CONFIG.distDir);
    await compileStyles();
    await compileScripts();
}

exports.compileAll = compileAll;
exports.compileScripts = compileScripts;
exports.compileStyles = compileStyles;
