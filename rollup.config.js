import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import html from 'rollup-plugin-html';
import json from 'rollup-plugin-json';
import less from './lib/rollup-plugin-less';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

let uglifyPlugin = uglify({}, minify);

let basePlugins = [
    json(),
    resolve(),
    commonjs(),
    html({
        include: [
            '**/*.svg',
            '**/*.html',
        ],
        htmlMinifierOptions: {
            collapseWhitespace: true,
            quoteCharacter: "'", // reduces escape characters
        },
    }),
    less({
        options: {
            paths: [
                'src/helix-ui/styles',
            ]
        }
    }),
];

export default [
    // browser-entry.js --> helix-ui.browser.js (IIFE)
    {
        input: 'src/browser-entry.js',
        output: {
            file: 'dist/scripts/helix-ui.browser.js',
            format: 'iife',
            intro: `window.addEventListener('WebComponentsReady', function () {`,
            outro: `});`,
        },
        plugins: [
            ...basePlugins,
            eslint({ include: [ '**/*.js' ] }),
            babel({ exclude: 'node_modules/**/*' }),
        ],
    },

    // helix-ui.browser.js --> helix-ui.browser.min.js (IIFE)
    {
        input: 'dist/scripts/helix-ui.browser.js',
        output: {
            file: 'dist/scripts/helix-ui.browser.min.js',
            format: 'iife',
        },
        plugins: [ uglifyPlugin ],
    },

    // module-entry.js --> helix-ui.mjs (ESM)
    {
        input: 'src/module-entry.js',
        output: {
            file: pkg.module,
            format: 'es',
        },
        plugins: [ ...basePlugins ],
    },
    // helix-ui.mjs --> helix-ui.min.mjs (ESM)
    {
        input: pkg.module,
        output: {
            file: 'dist/scripts/helix-ui.min.mjs',
            format: 'es',
        },
        plugins: [ uglifyPlugin ],
    },

    // node-entry.js --> helix-ui.js (CJS)
    {
        input: 'src/node-entry.js',
        output: {
            file: pkg.main,
            format: 'cjs',
        },
        plugins: [ ...basePlugins ],
    },
]
