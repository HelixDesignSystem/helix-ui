#!/usr/bin/env node
'use strict';

const CONFIG = require('../_config');
const Build = require('./build');
const ghPages = require('gh-pages');
const moment = require('moment');

// See https://github.com/tschaub/gh-pages#options
const _options = {
    add: false, // replace all gh-pages content, do not append
    silent: false,
    dotfiles: false,
    message: `Updated: ${moment().format('YYYY-MM-DD HH:mm:ss')}`
};

function publishSync () {
    console.log('Publishing Documentation');
    ghPages.publish(CONFIG.publicDir, _options, (err, obj) => {
        if (err) {
            console.log(`ERROR publishing: ${err.message}`);
        } else {
            console.log('obj', obj);
            console.log('Successfully published!');
        }
    });
}

exports.publishSync = publishSync;

if (require.main === module) {
    Build.buildSync();
    publishSync();
}
