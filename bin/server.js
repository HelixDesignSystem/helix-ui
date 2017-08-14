#!/usr/bin/env node
'use strict';

const browserSync = require('browser-sync').create();
const { hexo, config } = require('./hexo');

function initServer () {
    const serverRoutes = {}

    // account for Hexo "root" configuration
    serverRoutes[`${config.root}`] = config.public_dir;

    browserSync.init({
        files: [ // (See 'watchEvents')
            `${config.public_dir}/**/*`,
            {
                match: [
                    'source/**/*',
                    'themes/**/*'
                ],
                fn: (evt, file) => {
                    // force regeneration of hexo assets on change of source or theme
                    hexo.call('generate', { force: true });
                }
            }
        ],
        logLevel: 'debug',
        open: false,
        reloadOnRestart: true,
        reloadDebounce: 250, // prevent calling numerous reloads on forced hexo generate
        server: {
            baseDir: config.public_dir,
            routes: serverRoutes
        },
        watchEvents: ['change']
    });
}//initServer()

hexo.init().then(() => {
    hexo.call('clean')
        .then(() => {
            // MUST have empty obj as 2nd arg or the call will fail
            return hexo.call('generate', {});
        })
        .then(initServer)
        .catch((err) => {
            hexo.exit(err);
        });
});//hexo.init()
