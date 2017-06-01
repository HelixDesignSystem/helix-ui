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

browserSync.watch(['src/styles/*.less', 'src/styles/**/*.less']).on('change', () => {
    less.lessToCss(less.concatLess()).then(browserSync.reload);
});
