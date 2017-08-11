#!/usr/bin/env node
'use strict';

const Hexo = require('hexo');
const YAML = require('js-yaml');
const cwd = process.cwd();
const fs = require('fs');

exports.hexo = new Hexo(cwd);

exports.config = YAML.safeLoad(
    fs.readFileSync(`${cwd}/_config.yml`, 'utf8')
);

