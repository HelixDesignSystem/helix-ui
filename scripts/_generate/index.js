'use strict';

/*
 * Tasks in this file handle generating static assets
 * needed for the component explorer documentation.
 */

const LESS = require('less');
const SASS = require('node-sass');
const path = require('path');
const tar = require('tar');
const webpack = require('webpack');
const { copy, ensureDir, ensureDirSync, remove } = require('fs-extra');

const pkg = require('../../package.json');
const CONFIG = require('../_config');
const { exec, readFile, writeFile } = require('../_util');

const Context = require('./context');
const Markup = require('./markup');

async function generateStyles () {
    console.log('Generating CSS');
    let outDir = CONFIG.publicDir;

    let scssStyles = await generateScss();
    let lessStyles = await generateLess();

    let combinedCss = scssStyles + lessStyles;

    await ensureDir(outDir);
    await writeFile(`${outDir}/docs.css`, combinedCss);
    console.log('Generating CSS [DONE]');
}

/**
 * @returns {string} styles rendered from LESS
 */
async function generateLess () {
    let filename = 'docs.less';
    let inFile = path.join(CONFIG.docsDir, filename);
    let srcContent = await readFile(inFile, 'utf-8');

    let rendered = {};
    try {
        rendered = await LESS.render(srcContent, {
            paths: CONFIG.less.paths.map((filepath) => {
                return path.join(CONFIG.root, filepath);
            }),
            filename,
        });
    } catch (err) {
        console.log(`[GENERATE:Styles] Error: ${err.message}`);
        console.log('[GENERATE:Styles] skipping CSS compilation')
        return;
    }

    return rendered.css;
}

/**
 * @returns {string} styles rendered from SASS
 */
async function generateScss () {
    let rendered = await SASS.renderSync({
        ...CONFIG.sass,
        file: path.join(CONFIG.docsDir, 'index.scss'),
        outputStyle: 'expanded',
    });

    return rendered.css.toString();
}

function generateMarkupSync () {
    console.log('Generating HTML');
    let cfg = {
        files: [
            '*.html',
            '**/*.html',
            '!files/**', // ignore docs/files
        ],
    };

    // This is not async
    Markup.renderEach(cfg.files, (err, file) => {
        if (err) {
            throw err;
        }

        let destPath = `${CONFIG.publicDir}/${file.path}`;
        ensureDirSync(path.dirname(destPath));
        writeFile(destPath, file.content);
    });
}//generateMarkupSync()

async function generateApis () {
    console.log('Generate API docs');
    await exec(`yarn apidocs`, { cwd: CONFIG.root });
}//generateApis()

async function generateJSON () {
    console.log('Generating JSON');
    let data = await Context.getData();

    // for each key in data, generate an appropriate public/data/*.json file
    for (let name in data) {
        if (data.hasOwnProperty(name)) {
            let destPath = `${CONFIG.publicDir}/data/${name}.json`;

            // pretty print with 2-space indentation
            let content = JSON.stringify(data[name], null, 2);

            ensureDirSync(path.dirname(destPath));
            writeFile(destPath, content);
        }
    }
}//generateJSON

/**
 * Generates downloadable *.tgz assets
 */
async function generateDownloads () {
    let destDir = `${CONFIG.publicDir}/downloads`;

    let downloads = [
        {
            src: CONFIG.distDir,
            name: `helix-ui-${pkg.version}`,
        },
        {
            src: `${CONFIG.sourceDir}/images/icons`,
            name: `helix-ui-${pkg.version}-icons`,
        }
    ];

    // Make sure destination exists
    await ensureDir(destDir);

    downloads.forEach(async function (dl) {
        console.log(`Generating ${dl.name}.tgz`);
        let tmpDir = `${CONFIG.tmpDir}/${dl.name}`;

        // Ensure a clean slate
        await remove(tmpDir);

        // Create temporary directory so we can customize
        // the name of the uncompressed output.
        await ensureDir(tmpDir);

        await copy(dl.src, tmpDir);
        await tar.create({
            file: `${destDir}/${dl.name}.tgz`,
            gzip: true,
            cwd: CONFIG.tmpDir,
        }, [dl.name]);

        // Cleanup temporary files
        await remove(tmpDir);
    });
}//generateDownloads

/**
 * See https://webpack.js.org/api/node/
 * @async
 * @returns {Promise}
 */
function generateScripts () {
    console.log('Generating JavaScript');
    let sourcePath = `${CONFIG.root}/${CONFIG.sourceDir}`;
    let publicPath = `${CONFIG.root}/${CONFIG.publicDir}`;

    let compiler = webpack({
        // mode must be 'none' or 'development' to retain import order
        mode: 'development',
        entry: `${CONFIG.root}/${CONFIG.docsDir}/docs.js`,
        output: {
            path: `${CONFIG.root}/public`,
            filename: 'docs.js',
        },
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    use: 'svg-inline-loader',
                },
                {
                    test: /\.html$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.less$/,
                    use: [
                        { loader: 'raw-loader' },
                        {
                            loader: 'less-loader',
                            options: {
                                paths: CONFIG.less.paths
                            }
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        'babel-loader',
                        {
                            loader: 'eslint-loader',
                            options: {
                                globals: [
                                    'HelixUI',
                                ],
                            },
                        },
                    ]
                }
            ]
        },
        plugins: []
    });

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                console.log('ERROR: running webpack');
                console.log(err.message);
                reject(err);
            } else {
                let out = stats.toString({
                    chunks: false,  // Makes the build much quieter
                    colors: true    // Shows colors in the console
                });
                console.log(out);
                resolve(out);
            }
        });
    });
}//generateScripts()

async function generateAll () {
    await ensureDir(CONFIG.publicDir);

    generateMarkupSync();

    // wait for all async functions to finish
    await Promise.all([
        generateScripts(),
        generateApis(),
        generateStyles(),
        generateJSON(),
        generateDownloads(),
    ]);
}//generateAll()

module.exports = {
    generateAll,
    generateApis,
    generateDownloads,
    generateMarkupSync,
    generateScripts,
    generateStyles,
};
