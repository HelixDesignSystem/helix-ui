'use strict';

/*
 * Tasks in this file handle pushing assets to remote servers
 * for user consumption.
 */

const CONFIG = require('../_config');
const ghPages = require('gh-pages');
const moment = require('moment');

// Pushes public/ to github pages
async function publishDocs () {
    console.log('DOCS: Publishing to GitHub Pages'); // See https://github.com/tschaub/gh-pages#options
    let cfg = {
        add: false, // replace all gh-pages content, do not append
        silent: false,
        dotfiles: false,
        message: `Updated: ${moment().format('YYYY-MM-DD HH:mm:ss')}`
    };

    try {
        await ghPages.publish(CONFIG.publicDir, cfg);
        console.log('Successfully published!');
    } catch (err) {
        console.log(`ERROR publishing: ${err.message}`);
    }
}//publishDocs

exports.publishDocs = publishDocs;
