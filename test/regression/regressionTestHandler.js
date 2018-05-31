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
        'chrome',
        'safari',
        'internet explorer',
        'MicrosoftEdge'
    ];
}

if (args.components.length === 0) {
    args.components = ['.*'];
}

let matches = [];
args.components.forEach(component => {
    const grepCommand = `grep "\\bdata-visreg=" -r ../docs | grep "${component}\.html"`;
    const taggedForRegression = child_process.execSync(grepCommand).toString().trim();

    const componentExtractor = new RegExp("docs/(.*\\.html)", "gm");
    while (matched = componentExtractor.exec(taggedForRegression)) {
        const match = matched[1];
        if (matches.indexOf(match) < 0) {
            matches.push(match);
        }
    }
});

const sauceLabsBuildIdentifier = `local-dev-test-${new Date().toISOString()}`;
matches.forEach(component => {
    const directory = path.join('dom-snapshots', component.replace(/\.html$/, ''));
    fs.mkdirpSync(directory);
    const depth = directory.split(path.sep).length;
    args.browsers.forEach(browser => {
        const browserAlias = {
            ff: 'firefox',
            ie: 'internet explorer',
            edge: 'MicrosoftEdge'
        }[browser];
        browser = browserAlias ? browserAlias : browser;

        fs.writeFileSync(
            path.join(directory, `${browser}.ts`),
            generateSingleTest(browser, component, depth, sauceLabsBuildIdentifier)
        );
    });
});
