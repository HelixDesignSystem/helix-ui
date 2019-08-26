'use strict';

/*
 * Tasks in this file handle pushing assets to remote servers
 * for user consumption.
 */
const ghPages = require('gh-pages');
const moment = require('moment');

const PKG = require('../../package.json');
const CONFIG = require('../_config');

// Pushes public/ to github pages
async function publishDocs () {
    console.log('DOCS: Publishing to GitHub Pages'); // See https://github.com/tschaub/gh-pages#options
    let cfg = {
        add: false, // replace all gh-pages content, do not append
        dotfiles: false,
        message: `(${PKG.version}) Updated: ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
        remote: 'upstream',
        silent: false,
    };

    try {
        await ghPages.publish(CONFIG.publicDir, cfg);
        console.log('Successfully published!');
    } catch (err) {
        console.log(`ERROR publishing: ${err.message}`);
    }
}//publishDocs

exports.publishDocs = publishDocs;
