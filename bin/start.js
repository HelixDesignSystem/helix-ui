#!/usr/bin/env node
'use strict';

const CONFIG = require('../_config');
const _ = require('lodash');
const browserSync = require('browser-sync').create();
const exec = require('child_process').exec;
const { compileScripts, compileStyles } = require('../lib/compile');
const { copyDist } = require('../lib/copy');
const { generateAll } = require('../lib/generate');

const serverRoutes = {}
serverRoutes[CONFIG.site.baseHref] = CONFIG.publicDir;

browserSync.emitter.on('init', () => {
    console.log('Starting a selenium webdriver instance...');
    exec('yarn webdriver:start', { cwd: CONFIG.testDir }); // don't log anything to the dev server
});

browserSync.init({
    logLevel: 'debug',
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
                `${CONFIG.sourceDir}/*.less`,
                `${CONFIG.sourceDir}/**/*.less`,
                `!${CONFIG.sourceDir}/**/_*.less`, // (-) ShadowDOM CSS
            ],
            fn: _.debounce(function () {
                compileStyles();
                generateAll();
            }, 1500),
        },

        // Recompile toolkit scripts if any JS file changes in source directory
        {
            match: [
                `${CONFIG.sourceDir}/*.js`,
                `${CONFIG.sourceDir}/**/*.js`,
                `${CONFIG.sourceDir}/**/_*.less`, // (+) ShadowDOM CSS
            ],
            fn: _.debounce(compileScripts, 1500),
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
        {
            match: [
                `${CONFIG.testDir}/**/*.ts`,
                `!${CONFIG.testDir}/node_modules/**`,
                `!${CONFIG.testDir}/built/**/*`,
            ],
            fn: _.debounce(() => {
                const tsc = exec('yarn build', { cwd: CONFIG.testDir });
                tsc.stdout.pipe(process.stdout);
                tsc.stderr.pipe(process.stderr);
            }, 1500),
        },
    ],
});
