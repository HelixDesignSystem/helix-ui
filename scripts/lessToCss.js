#!/usr/bin/env node
'use strict';

let fs = require('fs');

let _ = require('lodash');
let less = require('less');
let CleanCss = require('clean-css');
let pkg = require('../package.json');

exports.lessToCss = (lessSource) => {
    console.log('Rendering CSS');
    return less.render(lessSource, {
        filename: `${pkg.name}.less`, // for debugging
        paths: [ // where @imports come from
            'src/styles/'
        ]
    }).then(output => {
        let minified = new CleanCss({
            advanced: true,
            sourceMap: true
        }).minify(output.css);

        console.log('Writing CSS');
        fs.writeFileSync(`docs/${pkg.name}.css`, output.css);
        fs.writeFileSync(`dist/${pkg.name}.min.css`, minified.styles);
        fs.writeFileSync(`dist/${pkg.name}.min.css.map`, minified.sourceMap);
    }, message => {
        console.warn(message);
        process.exit(1);
    });
};

exports.concatLess = () => {
    console.log('Concatenating less files...');
    return _.reduce([
        'src/styles/bootstrap.less',
        `src/styles/${pkg.name}.less`
    ], (acc, filename) => {
        acc.push(fs.readFileSync(filename, 'utf-8'));
        return acc;
    }, []).join('\n');
};

if (require.main === module) {
    exports.lessToCss(exports.concatLess());
}
