'use strict';

const CONFIG = require('../_config');
const nunjucks = require('nunjucks');

const njkSrcDir = `${CONFIG.root}/${CONFIG.docsDir}/_nunjucks`;

const envConfig = {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    noCache: true,
};

const loaders = [
    new nunjucks.FileSystemLoader(`${CONFIG.docsDir}/_templates`)
];

const env = new nunjucks.Environment(loaders, envConfig);

// See https://mozilla.github.io/nunjucks/api.html#custom-filters
env.addFilter('toc', require(`${njkSrcDir}/toc.filter`));

// See https://mozilla.github.io/nunjucks/api.html#custom-tags
env.addExtension('CodeTag', require(`${njkSrcDir}/code.tag`));

module.exports = env;
