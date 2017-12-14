#!/usr/bin/env node
'use strict';

const exec = require('child_process').exec;

const _ = require('lodash');

const Build = require('./build');
const Copy = require('./copy');
const CONFIG = require('../_config');
const Clean = require('./clean');
const browserSync = require('browser-sync').create();

// Clean out old assets
Clean.cleanSync();

// Build new assets
Build.buildSync();

// Start Server
const serverRoutes = {}
serverRoutes[CONFIG.site.baseHref] = CONFIG.publicDir;

browserSync.emitter.on('init', () => {
    console.log('Starting a selenium webdriver instance...');
    exec('yarn webdriver:start', { cwd: CONFIG.testDir }); // don't log anything to the dev server
});

browserSync.init({
    files: [ // (See 'watchEvents')
        // Reload browser if any file in public directory changes
        `${CONFIG.publicDir}/**/*`,

        // Rebuild if anything changes in source directory
        {
            match: [
                `${CONFIG.docsDir}/**/*`,
                `${CONFIG.sourceDir}/**/*`
            ],
            fn: _.debounce(Build.buildSync, 1500),
        },

        // Only copy when files change in dist/
        {
            match: [
                `${CONFIG.root}/dist/**/*`,
            ],
            fn: _.debounce(Copy.copySync, 1500),
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
    logLevel: 'debug',
    open: false,
    reloadOnRestart: true,
    reloadDebounce: 250, // prevent calling numerous reloads on forced hexo generate
    server: {
        baseDir: CONFIG.publicDir,
        routes: serverRoutes
    },
    watchEvents: ['change']
});
