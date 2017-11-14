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
                test: /\.html$/,
                use: 'raw-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'raw-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            paths: CONFIG.less.paths
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            }
        ]
    },
    plugins: []
});

function compileSync () {
    compiler.run((err, stats) => {
        if (err) {
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
