#!/usr/bin/env node
'use strict';

const fs = require('fs');
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

browserSync.emitter.on('init', () => {
    console.log('Starting a selenium webdriver instance...');
    exec('yarn run webdriver:start', { cwd: CONFIG.testDir }); // don't log anything to the dev server
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
                Build.buildSync();

                /**
                 * Always ensure that this task runs last, as it needs to wait for all
                 * synchronous build events to complete so that browserSync can finish
                 * and reload the page (and therefore, allow selenium to connnect).
                 */
                const tests = exec('yarn run test:regression -- -u', { cwd: CONFIG.testDir });
                // this *is* asynchronous, see comment above
                tests.stdout.pipe(process.stdout);
                tests.stderr.pipe(process.stderr);
            }
        },

        // Re-transpile test files
        {
            match: [
                `${CONFIG.testDir}/**/*.ts`,
                `!${CONFIG.testDir}/built/**/*`
            ],
            fn: () => {
                const tsc = exec('yarn run build', { cwd: CONFIG.testDir });
                tsc.stdout.pipe(process.stdout);
                tsc.stderr.pipe(process.stderr);
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
