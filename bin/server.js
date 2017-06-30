#!/usr/bin/env node
'use strict';

let hexo = require('./hexo').hexo;
let browserSync = require('browser-sync').create();

function initServer () {
    let publicDir = 'docs/public';

    browserSync.init({
        files: [ // (See 'watchEvents')
            `${publicDir}/**/*`,
            {
                match: [
                    'docs/source/**/*',
                    'docs/themes/**/*'
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
            baseDir: publicDir,
            routes: {
                '/helix-ui/': publicDir // account for Hexo "root" configuration
            }
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

// TODO: "release" task to generate, copy, and minify CSS assets
