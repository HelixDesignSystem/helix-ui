import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import html from 'rollup-plugin-html';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import { minify } from 'uglify-es';
import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json';
import less from './rollup-utils/rollup-plugin-less';
import sass from './rollup-utils/rollup-plugin-sass';

/* ======================================== *\
 * SETUP PLUGINS
\* ======================================== */

// run through babel transpilation
let babelPlugin = babel({
    exclude: 'node_modules/**/*',
});

// check code quality
let eslintPlugin = eslint({
    include: [
        '**/*.js',
    ],
});

// import SVG and HTML files as JS strings
let htmlPlugin = html({
    include: [
        '**/*.svg',
        '**/*.html',
    ],
    htmlMinifierOptions: {
        collapseWhitespace: true,
        quoteCharacter: "'", // reduces escape characters
    },
});

// import LESS files as JS strings
let lessPlugin = less({
    options: {
        // TODO: centralize common config settings
        paths: [
            'src/less',
        ],
    },
});

// import SASS/SCSS files as JS strings
// see: https://sass-lang.com/documentation/js-api
let sassPlugin = sass({
    options: {
        // TODO: centralize common config settings
        includePaths: [
            'src/scss',
        ],
        outputStyle: 'compact', // each style block on its own line (reduce generated white space)
        precision: 4,
    },
});

/* ======================================== *\
 * ROLLUP CONFIGURATION
\* ======================================== */

export default [
    /* ----- BROWSER TARGETS ----- */

    // src/_bundle.umd.js --> dist/*/helix-ui.browser.js (UMD)
    {
        input: 'src/_bundle.umd.js',
        output: {
            file: 'dist/scripts/helix-ui.browser.js',
            format: 'umd',
            name: 'HelixUI',
            sourcemap: false,
        },
        plugins: [
            json(),
            nodeResolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
            sassPlugin,
            babelPlugin,
        ],
    },

    // src/_bundle.umd.js --> dist/*/helix-ui.browser.min.js (UMD)
    {
        input: 'src/_bundle.umd.js',
        output: {
            file: 'dist/scripts/helix-ui.browser.min.js',
            format: 'umd',
            name: 'HelixUI',
            sourcemap: false,
        },
        plugins: [
            eslintPlugin,
            json(),
            nodeResolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
            sassPlugin,
            babelPlugin,
            uglify({}, minify),
        ],
    },

    /* ----- NODE/BUNDLER TARGETS ----- */

    // src/index.js --> dist/helix-ui.js (CJS)
    // src/index.js --> dist/helix-ui.es.js (ESM)
    {
        input: 'src/index.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
            },
            {
                file: pkg.module,
                format: 'es',
            }
        ],
        plugins: [
            json(),
            nodeResolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
            sassPlugin,
        ],
    },
]
