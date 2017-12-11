'use strict';

const _ = require('lodash');
const path = require('path');
const CONFIG = {};

// PATHS
CONFIG.root = path.resolve(__dirname);// absolute path to project directory
CONFIG.publicDir = 'public';
CONFIG.sourceDir = 'src';
CONFIG.docsDir = 'docs';
CONFIG.templateDir = `${CONFIG.docsDir}/_templates`;
CONFIG.testDir = 'test';

// Component Explorer configuration
// Used directly for "site" rendering context
CONFIG.site = {
    title: 'HelixUI',
    language: 'en',
    baseHref: '/helix-ui/',
    // Moment.js format string
    dateFormat: 'YYYY-MM-DD',
    // Moment.js format string
    timeFormat: 'HH:mm:ss',
};

// Configuration for the LESS precompiler
CONFIG.less = {
    paths: [
        `${CONFIG.docsDir}/styles`,
        `${CONFIG.sourceDir}/helix-ui/styles`
    ],
    // [src, dest]
    files: [
        [ `${CONFIG.sourceDir}/helix-ui.less`, 'dist/helix-ui.css' ],
        [ `${CONFIG.docsDir}/docs.less`, 'public/docs.css' ],
    ],
};

// TODO: move to lib/webpack.js
// Configuration for the webpack build tool
CONFIG.webpack = {
    entry: `${CONFIG.root}/${CONFIG.docsDir}/docs.js`,
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'docs.js',
    }
};

// Configuration for generating static documentation
CONFIG.docs = {
    files: [
        '*.html',
        '**/*.html',
    ],
    // settings for deployment to github pages
    ghPages: {
        type: 'git',
        repo: 'git@github.com:rackerlabs/helix-ui.git',
        branch: 'gh-pages',
        message: `Docs Updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`,
        url: 'https://rackerlabs.github.io/helix-ui'
    }
};

// Files and directories to copy to publicDir
// All paths are relative to {CONFIG.sourceDir}
CONFIG.copy = {
    dirs: [ 'images' ]
};

/* Define Exports */
module.exports = CONFIG;
