#!/usr/bin/env node
'use strict';

const Copy = require('./copy');
const Docs = require('../lib/docs');
const Styles = require('../lib/styles');
const Webpack = require('../lib/webpack');

function buildSync () {
    console.log('Compiling JavaScript');
    Webpack.compileSync();

    console.log('Compiling CSS');
    Styles.compileSync();

    console.log('Compiling Documentation');
    Docs.compileSync();

    console.log('Copying Files');
    Copy.copySync();
}

exports.buildSync = buildSync;
exports.docsSync = Docs.compileSync;
exports.stylesSync = Styles.compileSync;
exports.scriptsSync = Webpack.compileSync;

if (require.main === module) {
    buildSync();
}
