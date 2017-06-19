#!/usr/bin/env node
'use strict';

let hexo = require('./hexo').hexo;
let browserSync = require('browser-sync').create();

function initServer () {
    browserSync.init({
        open: false,
        reloadOnRestart: true,
        reloadDebounce: 250, // prevent calling numerous reloads on forced hexo generate
        server: 'docs/public'
    });

    /* ==================== WARNING ==================== */
    // don't watch on just everything -- only 'change' events
    // https://www.browsersync.io/docs/api#api-watch
    // if you do, it'll launch the less conversion task on every
    // 'add' event that occurs (one for every less file bs sees on startup!)

    // Regenerate docs when source or theme files change
    browserSync.watch([
        'docs/source/**/*',
        'docs/themes/helix-ui/**/*'
    ]).on('change', () => {
        hexo.call('generate', {
            force: true
        });
    });

    // Reload when generated files change
    browserSync.watch('docs/public/**/*', browserSync.reload);
}//initServer()

hexo.init().then(() => {
    hexo.call('clean')
        .then(() => {
            return hexo.call('generate', {});
        })
        .then(initServer)
        .catch((err) => {
            hexo.exit(err);
        });
});//hexo.init()

// TODO: "release" task to generate, copy, and minify CSS assets
