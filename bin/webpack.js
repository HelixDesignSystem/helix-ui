'use strict';

// REF: https://webpack.js.org/api/node/

const path = require('path');
const webpack = require('webpack');

const rootPath = path.resolve(__dirname, '..');
const sourcePath = `${rootPath}/source`;
const publicPath = `${rootPath}/public`;

const config = {
    entry: {
        'helix-ui': `${sourcePath}/scripts/_helix-ui.js`,
        'explorer': `${sourcePath}/scripts/_explorer.js`
    },
    output: {
        path: `${publicPath}/scripts`,
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
};

exports.compiler = webpack(config);
