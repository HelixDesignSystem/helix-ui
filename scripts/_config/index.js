'use strict';

const path = require('path');
const CONFIG = {};

/* ===== PATHS ===== */
// absolute path to project directory
CONFIG.root = path.resolve(__dirname, '../../');
CONFIG.publicDir = 'public';
CONFIG.sourceDir = 'src';
CONFIG.docsDir = 'docs';
CONFIG.testDir = 'test';
CONFIG.distDir = 'dist';
CONFIG.tmpDir = '_tmp';

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
        `${CONFIG.sourceDir}/less`
    ],
};

CONFIG.sass = {
    includePaths: [
        `${CONFIG.sourceDir}/scss`
    ],
    precision: 4,
}

/* Define Exports */
module.exports = CONFIG;
