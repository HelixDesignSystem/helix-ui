'use strict';

const _ = require('lodash');
const path = require('path');

let _privateConfig;

try {
    _privateConfig = require('./_config.private');
} catch (e) {
    _privateConfig = {};
}
const CONFIG = {};

// PATHS
CONFIG.root = path.resolve(__dirname);// absolute path to project directory
CONFIG.publicDir = 'public';
CONFIG.sourceDir = 'source';
CONFIG.templateDir = `${CONFIG.sourceDir}/_templates`;
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
        `${CONFIG.sourceDir}/_less`,
        `${CONFIG.sourceDir}/components`
    ],
    files: [
        `${CONFIG.sourceDir}/helix-ui.less`,
        `${CONFIG.sourceDir}/docs.less`,
        `${CONFIG.sourceDir}/bootstrap.helix.less`,
    ],
};

// Configuration for the webpack build tool
CONFIG.webpack = {
    // entrypoints for compilation
    entry: {
        // TODO: see if key/value object is still needed, given we have proper names
        /* <name>: <source file> */
        // NOTE: source fileneeds to be full path, not relative
        'helix-ui': `${CONFIG.root}/${CONFIG.sourceDir}/helix-ui.js`,
        'docs': `${CONFIG.root}/${CONFIG.sourceDir}/docs.js`
    }
};

// Configuration for generating static documentation
CONFIG.docs = {
    files: [
        'index.html',
        'components/**/index.html',
        'guides/**/index.html'
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
    dirs: [
        'images',
    ]
};

// Configuration to publish assets to Cloud Files
// Local-to-Remote path mapping
const _cdnFiles = {};
_cdnFiles[`${CONFIG.publicDir}/bootstrap.helix.css`] = 'css/bootstrap.helix.css';
_cdnFiles[`${CONFIG.publicDir}/helix-ui.css`] = 'css/helix-ui.css';
_cdnFiles[`${CONFIG.publicDir}/helix-ui.js`] = 'javascript/helix-ui.js';
CONFIG.cdn = {
    files: _cdnFiles,
    storage: {} // override in _config.private.js
};

const combinedConfig = _.merge({}, CONFIG, _privateConfig);

/* Define Exports */
module.exports = combinedConfig;
