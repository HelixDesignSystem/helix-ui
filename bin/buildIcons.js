#!/usr/bin/env node

const fs = require('fs');
const globby = require('globby');
const path = require('path');
const iconFolder = path.resolve(__dirname, '../src/helix-ui/icons/')

const Icons = {};
globby.sync('*.svg', { cwd: iconFolder }).forEach(file => {
    let filename = path.join(iconFolder, file)
    let data = fs.readFileSync(filename, { encoding: 'utf8' });
    Icons[file] = data;
});

let jsonString = JSON.stringify(Icons, null, 2);
fs.writeFileSync(path.join(iconFolder, 'icons.json'), jsonString);
