#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const generateSingleTest = require('./generateSingleTest');
const rawArgs = Array.prototype.slice.call(process.argv, 2);

const args = { browsers: [], components: [] };
rawArgs.forEach(argWithFlag => {
    const flagWithVal = argWithFlag.split('=');
    const flag = flagWithVal[0].slice(2); // chop off leading "--" of arg name
    const val = flagWithVal[1].split(',');
    args[flag] = val;
});

if (args.browsers.length === 0) {
    args.browsers = [
        'firefox',
        'chrome'  
    ];
}

if (args.components.length === 0) {
    args.components = ['.*'];
}

let matches = [];
args.components.forEach(component => {
    // todo -- move this to a node-based solution!
    const grepCommand = `grep "\\bdata-visreg=" -r ../docs | grep "${component}.*html"`;
    const taggedForRegression = child_process.execSync(grepCommand).toString().trim();

    const componentExtractor = new RegExp("docs/(.*\\.html)", "gm");
    while (matched = componentExtractor.exec(taggedForRegression)) {
        const match = matched[1];
        if (matches.indexOf(match) < 0) {
            matches.push(match);
        }
    }
});

matches.forEach(component => {
    args.browsers.forEach(browser => {
        const browserAlias = {
            ff: 'firefox'
        }[browser];
        browser = browserAlias ? browserAlias : browser;
        const browserFilename = browser.replace(/\s/g, '-');
        const fileName = [component.replace(/\//g, '-').replace(/\.html/, '').replace(/(-test|-index)/, ''), browserFilename].join('-');
        fs.writeFileSync(
            path.join('dom-snapshots', `${fileName}.ts`),
            generateSingleTest(browser, component)
        );
    });
});