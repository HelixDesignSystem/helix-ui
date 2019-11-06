import { eslint } from 'rollup-plugin-eslint'; // NEEDED?
import { terser } from 'rollup-plugin-terser';
import pBabel from 'rollup-plugin-babel';
import pHtml from 'rollup-plugin-html';
import pJson from 'rollup-plugin-json';
import pResolve from 'rollup-plugin-node-resolve';

import pSass from './plugin-sass';

import { sass } from '../config';

export const jsonPlugin = pJson();
export const resolvePlugin = pResolve();

// Check code quality
// NOTE: may not be necessary, but bringing it in from the old rollup config
export const eslintPlugin = eslint({
    include: [
        '**/*.js',
    ],
});

// transpile syntax
export const babelPlugin = pBabel({
    exclude: 'node_modules/**/*',
});

// Minification
export const terserPlugin = terser({
    exclude: [
        /node_modules/,
    ],
    output: {
        comments: function (node, comment) {
            let { value, type } = comment;
            if (type === "comment2") { // multiline comment
                return /@license/i.test(value);
            }
            return false;
        }
    }
});

// import *.html as JS string
export const htmlPlugin = pHtml({
    include: [
        '**/*.svg',
        '**/*.html',
    ],
    htmlMinifierOptions: {
        collapseWhitespace: true,
        quoteCharacter: "'", // reduces escape characters
    },
});

/**
 * compile *.scss to CSS and import as JS string
 * @see https://sass-lang.com/documentation/js-api
 */
export const sassPlugin = pSass({
    options: {
        ...sass,

        // each style block on its own line
        // (reduce generated white space)
        outputStyle: 'compact',
    },
});

const basePlugins = [
    jsonPlugin,
    resolvePlugin,
    htmlPlugin,
    sassPlugin,
];

export const es6plugins = [
    ...basePlugins
];

export const es5plugins = [
    ...basePlugins,
    babelPlugin,
];
