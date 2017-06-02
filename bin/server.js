#!/usr/bin/env node
'use strict';

let browserSync = require('browser-sync').create();
let less = require('./lessToCss');

browserSync.init({
    server: 'docs'
});

browserSync.watch([
    'docs/*.html'
], browserSync.reload);

// don't watch on just everything -- only 'change' events
// https://www.browsersync.io/docs/api#api-watch
// if you do, it'll launch the less conversion task on every
// 'add' event that occurs (one for every less file bs sees on startup!)
browserSync.watch(['src/styles/**/*.less']).on('change', () => {
    less.lessToCss(less.concatLess()).then(browserSync.reload);
});
