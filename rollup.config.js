import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import html from 'rollup-plugin-html';
import json from 'rollup-plugin-json';
import pkg from './package.json';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';
import less from './lib/rollup-plugin-less';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let htmlPlugin = html ({
    include: [
        '**/*.svg',
        '**/*.html',
    ],
    htmlMinifierOptions: {
        collapseWhitespace: true,
        quoteCharacter: "'", // reduces escape characters
    },
});

let babelPlugin = babel({
    exclude: 'node_modules/**/*',
});

let lessPlugin = less({
    options: {
        paths: [
            'src/helix-ui/styles',
        ]
    }
});

let cleanOpts = {
    comments: 'none',
};

// Intro/Outro placed INSIDE the applied dependency function
let intro = `window.addEventListener('WebComponentsReady', function () {`;
let outro = `});`;

export default [
    // src/browser-entry.js --> dist/helix-ui.browser.js (UMD)
    {
        input: 'src/browser-entry.js',
        name: 'HelixUI',
        sourcemap: false,
        intro,
        outro,
        output: [
            {
                file: 'dist/scripts/helix-ui.browser.js',
                format: 'umd',
            }
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
            babelPlugin,
            cleanup(cleanOpts),
        ],
        watch: {
            include: 'src/**/*',
            exclude: 'node_modules/**',
        },
    },

    // src/browser-entry.js --> dis/helix-ui.browser.min.js (UMD)
    {
        input: 'src/browser-entry.js',
        name: 'HelixUI',
        sourcemap: false,
        intro,
        outro,
        output: [
            {
                file: 'dist/scripts/helix-ui.browser.min.js',
                format: 'umd',
            }
        ],
        plugins: [
            json(),
            resolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
            babelPlugin,
            uglify({}, minify),
        ],
        watch: {
            include: 'src/**/*',
            exclude: 'node_modules/**',
        },
    },

    // src/node-entry.js --> dist/helix-ui.js (CJS)
    // src/node-entry.js --> dist/helix-ui.es.js (ESM)
    {
        input: 'src/node-entry.js',
        name: 'HelixUI',
        sourcemap: false,
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
            resolve(),
            commonjs(),
            htmlPlugin,
            lessPlugin,
        ],
    },

    // src/polyfills.js --> dis/helix-ui.polyfills.js (IIFE)
    {
        input: 'src/polyfills.js',
        sourcemap: false,
        output: [
            {
                file: 'dist/scripts/helix-ui.polyfills.js',
                format: 'iife',
            }
        ],
        plugins: [
            babelPlugin,
            cleanup(cleanOpts),
        ],
    },

    // src/polyfills.js --> dis/helix-ui.polyfills.min.js (IIFE)
    {
        input: 'src/polyfills.js',
        sourcemap: false,
        output: [
            {
                file: 'dist/scripts/helix-ui.polyfills.min.js',
                format: 'iife',
            }
        ],
        plugins: [
            babelPlugin,
            uglify({}, minify),
        ],
    },
]
