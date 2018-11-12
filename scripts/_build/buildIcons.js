const HTMLMinify = require('html-minifier').minify;
const globby = require('globby');
const path = require('path');
const { ensureDir } = require('fs-extra');

const { readFile, writeFile } = require('../_util');

/* Module Definition */

const SOURCE_DIR = path.resolve(__dirname, '../../src/');

const destinationDir = path.join(SOURCE_DIR, 'icons'); // TODO: change destination to lib/
const originDir = path.join(SOURCE_DIR, 'icons');

/**
 * @async
 * @param {string} filename
 * @returns {Promise<object>} resolved to file metadata with minified svg content
 */
async function _parseFile (filename) {
    let absFilePath = path.join(originDir, filename);
    let basename = path.basename(filename, path.extname(filename));

    let rawSvg = await readFile(absFilePath, { encoding: 'utf8' });

    // TODO: add SVGO functionality to minification process
    let svg = HTMLMinify(rawSvg, {
        collapseWhitespace: true,
        quoteCharacter: "'", // reduce escape characters
        removeComments: true,
    });

    return { basename, svg };
}

/**
 * Build icons.json for consumption by HXIconElement
 * @async
 */
async function buildIcons () {
    console.log(`Building ${destinationDir}/icons.json`);

    // [ 'account.svg', 'angle-bottom.svg', ... ]
    let files = await globby('*.svg', { cwd: originDir });

    // [Promise<object>, ... ]
    let parsedFiles = files.map(_parseFile);

    // [{ basename, svg }, ... ]
    let metadata = await Promise.all(parsedFiles);

    // { account: '<svg>...</svg>', angleDown: '<svg>...</svg>', ... }
    const ICONS = metadata.reduce((icons, datum) => {
        let { basename, svg } = datum;
        icons[basename] = svg;
        return icons;
    }, {});

    await ensureDir(destinationDir);

    let filePath = path.join(destinationDir, 'icons.json');
    let fileData = JSON.stringify(ICONS, null, 2);
    await writeFile(filePath, fileData);
}

module.exports = buildIcons;
