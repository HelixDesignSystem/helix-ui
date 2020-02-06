#!/usr/bin/env node
'use strict';

require = require('esm')(module);

const _ = require('lodash');
const browserSync = require('browser-sync').create();
const exec = require('child_process').exec;

const CONFIG = require('./_config');
const { copyDist } = require('./_util/copy');
const { generateAll, generateApis } = require('./_generate');

const serverRoutes = {};
serverRoutes[CONFIG.site.baseHref] = CONFIG.publicDir;

// new pipeline functionality
const {
    bundleStyles,
    bundleBrowsers: bundleBrowserScripts,
} = require('../tasks/bundle');

/**
 * 2019-11-01: Disabling Selenium, because it's currently not
 * being used and wasting system resources
 */

//browserSync.emitter.on('init', () => {
//    console.log('Starting a selenium webdriver instance...');
//    exec('yarn webdriver:start', { cwd: CONFIG.testDir }); // don't log anything to the dev server
//});

const lintStylesGlob = `${CONFIG.sourceDir}/**/*.{scss,css}`;

function _regenDocs () {
    bundleStyles();
    generateAll();
}

function _regenSrc () {
    bundleBrowserScripts();

    // always regenerate docs when source files change
    _regenDocs();
}

browserSync.init({
    logLevel: 'debug',
    notify: false,
    open: false,
    reloadOnRestart: true,
    reloadDebounce: 250,
    server: {
        baseDir: CONFIG.publicDir,
        routes: serverRoutes
    },
    watchEvents: ['change'],
    files: [
        // Reload browser if any file in public directory changes
        `${CONFIG.publicDir}/*`,
        `${CONFIG.publicDir}/**/*`,

        // Regenerate docs if anything changes in the docs directory
        // or if any LightDOM CSS changes in the source directory
        {
            match: [
                `${CONFIG.docsDir}/*`,
                `${CONFIG.docsDir}/**/*`,
                // Ignore raw API data files
                `!${CONFIG.docsDir}/api/*`,
                `!${CONFIG.docsDir}/api/**/*`,
            ],
            fn: _.debounce(_regenDocs, 1500),
        },

        {
            match: [
                // Changes to any source file can modify compiled JS output
                `${CONFIG.sourceDir}/**/*`,

                // ignore changes to test files
                `!${CONFIG.sourceDir}/**/*.spec.js`,
            ],
            fn: _.debounce(_regenSrc, 1500),
        },

        // Generate API docs when src files change
        {
            match: [
                // ANY JavaScript file in the src/ directory should
                // trigger generation of API docs...
                `${CONFIG.sourceDir}/**/*.js`,
                // ... excluding spec files
                `!${CONFIG.sourceDir}/**/*.spec.js`,
            ],
            fn: _.debounce(generateApis, 1500),
        },

        {
            match: [
                lintStylesGlob,
            ],
            fn: _.debounce(() => {
                let _cmd = `stylelint --color "${lintStylesGlob}"`;
                let _proc = exec(_cmd, { cwd: CONFIG.root });

                _proc.stdout.pipe(process.stdout);
                _proc.stderr.pipe(process.stderr);
            }),
        },

        // Only copy when files change in dist/
        {
            match: [
                `${CONFIG.distDir}/*`,
                `${CONFIG.distDir}/**/*`,
            ],
            fn: _.debounce(copyDist, 1500),
        },

        // Re-transpile test files
        // 2019-11-01: temporarily disabled (unused; wasting cpu cycles)
        //{
        //    match: [
        //        `${CONFIG.testDir}/**/*.ts`,
        //        `!${CONFIG.testDir}/node_modules/**`,
        //        `!${CONFIG.testDir}/built/**/*`,
        //    ],
        //    fn: _.debounce(() => {
        //        const tsc = exec('yarn build', { cwd: CONFIG.testDir });
        //        tsc.stdout.pipe(process.stdout);
        //        tsc.stderr.pipe(process.stderr);
        //    }, 1500),
        //},
    ],
});
