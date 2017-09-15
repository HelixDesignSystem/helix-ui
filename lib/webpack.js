'use strict';

// See https://webpack.js.org/api/node/

const CONFIG = require('../_config');
const path = require('path');
const webpack = require('webpack');

const sourcePath = `${CONFIG.root}/${CONFIG.sourceDir}`;
const publicPath = `${CONFIG.root}/${CONFIG.publicDir}`;

const compiler = webpack({
    entry: CONFIG.webpack.entry,
    output: {
        path: `${publicPath}`,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: 'svg-inline-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    },
    plugins: []
});

function compileSync () {
    compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
            console.log('ERROR: running running webpack');
            console.log(err.message);
        }

        console.log(stats.toString({
            chunks: false,  // Makes the build much quieter
            colors: true    // Shows colors in the console
        }))
    });
}//compileSync

exports.compileSync = compileSync;
