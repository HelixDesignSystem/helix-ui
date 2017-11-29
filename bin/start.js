#!/usr/bin/env node
'use strict';

const exec = require('child_process').exec;

const Build = require('./build');
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

let devDebounceMarker = new Date().valueOf();
let testDebounceMarker = new Date().valueOf();
const timeSinceDebounce = (marker) => {
    return (new Date().valueOf() - marker) / 1000;
};

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
                `${CONFIG.sourceDir}/**/*`
            ],
            fn: () => {
                if (timeSinceDebounce(devDebounceMarker) > 5) {
                    const lint = exec('yarn lint');
                    lint.stderr.pipe(process.stderr);

                    Build.buildSync();
                }

                devDebounceMarker = new Date().valueOf();
            }
        },

        // Re-transpile test files
        {
            match: [
                `${CONFIG.testDir}/**/*.ts`,
                `!${CONFIG.testDir}/node_modules/**`,
                `!${CONFIG.testDir}/built/**/*`,
            ],
            fn: () => {
                if (timeSinceDebounce(testDebounceMarker) > 5) {
                    const tsc = exec('yarn build', { cwd: CONFIG.testDir });
                    tsc.stdout.pipe(process.stdout);
                    tsc.stderr.pipe(process.stderr);
                }

                testDebounceMarker = new Date().valueOf();
            }
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
