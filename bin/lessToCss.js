#!/usr/bin/env node
'use strict';

/*
 * TODO:
 * With the use of Hexo to compile LESS to CSS, we may want
 * to repurpose this script to minimize what's generated from
 * Hexo for the purposes of distribution.
 *
 * LESS --[Hexo]--> CSS --[this script]--> MIN.CSS
 */

let fs = require('fs');

let _ = require('lodash');
let less = require('less');
let CleanCss = require('clean-css');
let pkg = require('../package.json');

const DIST = 'dist/css';

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

        if (!fs.existsSync(`${DIST}`)) {
            fs.mkdirSync(`${DIST}`);
        }

        console.log('Writing CSS');
        fs.writeFileSync(`${DIST}/${pkg.name}.css`, output.css);
        fs.writeFileSync(`${DIST}/${pkg.name}.min.css`, minified.styles);
        fs.writeFileSync(`${DIST}/${pkg.name}.min.css.map`, minified.sourceMap);
    }, message => {
        console.warn(message);
        process.exit(1);
    });
};

exports.concatLess = () => {
    console.log('Concatenating less files...');
    return _.reduce([
        `src/styles/${pkg.name}.less`
    ], (acc, filename) => {
        acc.push(fs.readFileSync(filename, 'utf-8'));
        return acc;
    }, []).join('\n');
};

if (require.main === module) {
    exports.lessToCss(exports.concatLess());
}
