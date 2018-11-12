const CleanCSS = require('clean-css');
const HTMLMinify = require('html-minifier').minify;
const globby = require('globby');
const less = require('less');
const path = require('path');
const { ensureDir } = require('fs-extra');

const { readFile, writeFile } = require('../_util');

/* Module Definition */

const SOURCE_DIR = path.resolve(__dirname, '../../src/');

const destinationDir = path.join(SOURCE_DIR, 'elements'); // TODO: change destination to lib/
const originDir = path.join(SOURCE_DIR, 'elements');
const lessStylesDir = path.join(SOURCE_DIR, 'styles');

/**
 * @async
 * @param {string} rawHtml - raw HTML source code
 * @returns {Promise<string>} Resolves to minified HTML markup
 */
async function _readHTML (rawHtml) {
    return HTMLMinify(rawHtml, {
        collapseWhitespace: true,
        quoteCharacter: "'", // reduces escape characters
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
    });
}

/**
 * @async
 * @param {path} absFilePath - absolute file path to LESS source code
 * @param {string} rawLess - raw LESS source code
 * @returns {Promise<string>} Resolves to minified CSS
 */
async function _parseLESS(absFilePath, rawLess) {
    let rendered = await less.render(rawLess, {
        filename: absFilePath,
        paths: [ lessStylesDir ]
    });

    let minified = new CleanCSS().minify(rendered.css);

    return minified.styles;
}

/**
 * Divides up work to parse different file types.
 * @async
 * @param {string} filename
 * @returns {Promise<object>} Resolves to file metadata object containing partial ShadowDOM content
 */
async function _parseFile (filename) {
    let absFilePath = path.join(originDir, filename);
    let ext = path.extname(filename);
    let basename = path.basename(filename, ext);

    let meta = { basename };
    let fileContent = await readFile(absFilePath, { encoding: 'utf8' });
    switch (ext) {
        case '.html':
            meta.markup = await _readHTML(fileContent);
            break;

        case '.less':
            meta.styles = await _parseLESS(absFilePath, fileContent);
            break;

        default:
            throw new Error(`Unsupported file type: ${filename}`);
            break;
    }

    return meta;
}

/**
 * Combines partial metadata objects into a single template object value for each unique basename.
 * @private
 * @param {object} templates - accumulator
 * @param {object} datum - resolved file metadata object from _parseFile()
 * @returns {object} accumulator
 */
function _aggregateMetadata (templates, datum) {
    let { basename, markup, styles } = datum;
    let _template = templates[basename] || {};

    if (markup) {
        _template.markup = markup;
    }

    if (styles) {
        _template.styles = styles;
    }

    templates[basename] = _template;

    return templates;
}

/**
 * Build templates.json for consumption by custom elements with Shadow DOM.
 * @async
 */
async function buildTemplates () {
    console.log(`Building ${destinationDir}/templates.json`);

    // ['HXAccordionPanelElement.html', 'HXAccordionPanelElement.less', ...]
    let files = await globby([
        '*.(html|less)',
        '!HXElement.less',
        '!_*'
    ], { cwd: originDir });

    // [Promise<object>, ...]
    let parsedFiles = files.map(_parseFile);

    // [{ filename, styles|markup }, ...]
    let metadata = await Promise.all(parsedFiles);

    // { HXAccordionPanelElement: { styles: '', markup: '' }, ... }
    const TEMPLATES = metadata.reduce(_aggregateMetadata, {});

    await ensureDir(destinationDir);

    let filePath = path.join(destinationDir, 'templates.json');
    let fileData = JSON.stringify(TEMPLATES, null, 2);
    await writeFile(filePath, fileData);
}

module.exports = buildTemplates;
