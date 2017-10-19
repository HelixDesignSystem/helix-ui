#!/usr/bin/env node
'use strict';

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

browserSync.init({
    files: [ // (See 'watchEvents')
        // Reload browser if any file in public directory changes
        `${CONFIG.publicDir}/**/*`,
        // Rebuild if anything changes in source directory
        {
            match: [
                `${CONFIG.sourceDir}/**/*`
            ],
            fn: (evt, file) => {
                Build.buildSync();
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
