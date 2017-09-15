'use strict';

const CONFIG = require('../../_config');
const nunjucks = require('nunjucks');

const envConfig = {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    noCache: true,
};

const loaders = [
    new nunjucks.FileSystemLoader(CONFIG.templateDir)
];

const env = new nunjucks.Environment(loaders, envConfig);

// See https://mozilla.github.io/nunjucks/api.html#custom-filters
env.addFilter('toc', require('./toc.filter'));

// See https://mozilla.github.io/nunjucks/api.html#custom-tags
env.addExtension('CodeTag', require('./code.tag'));

module.exports = env;

