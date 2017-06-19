// NOTE: this is the start of a webpack config should we choose to go with webpack
const webpack = require('webpack');
const path = require('path');

const rootPath = path.resolve(__dirname);

module.exports = {
    devtool: 'source-map',
    entry: './src/main.js',
    output: {
        path: `${rootPath}/dist/js`,
        filename: 'helix-ui.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }, {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
    ]
};
