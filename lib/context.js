'use strict';

const CONFIG = require('../_config');
const JSON5 = require('json5');
const PKG = require('../package.json');
const _ = require('lodash');
const fm = require('front-matter');
const fs = require('fs');
const globby = require('globby');
const moment = require('moment');
const path = require('path');

// Fetch data from {CONFIG.docsDir}/_data
function _getDataContext () {
    const dataDir = `${CONFIG.root}/${CONFIG.docsDir}/_data`;
    const json5files = globby.sync(['*.json5'], { cwd: dataDir });

    return json5files.reduce((obj, file)=> {
        const basename = path.basename(file, path.extname(file));
        obj[basename] = JSON5.parse(
            fs.readFileSync(`${dataDir}/${file}`, 'utf8')
        );
        return obj;
    }, {});
}//_getDataContext()

// Fetch context from file frontmatter (if present)
function _getFrontMatter (relPath) {
    let frontMatter = {};

    try {
        let content = fs.readFileSync(`${CONFIG.docsDir}/${relPath}`, 'utf8');
        if (fm.test(content)) {
            Object.assign(frontMatter, fm(content).attributes);
        }
    } finally {
        // nothing to do
    }

    return frontMatter;
}//_getFrontMatter()

// Fetch context about a particular file
function _getPageContext (relPath) {
    const sourcePath = `${CONFIG.docsDir}/${relPath}`;
    const fileStats = fs.statSync(sourcePath);

    let fileContext = {
        path: relPath,
        updated: moment(fileStats.mtime),
    };

    try {
        fileContext.raw = fs.readFileSync(sourcePath, { encoding: 'utf8' });
    } catch (e) {
        fileContext.raw = '';
    }

    let frontMatter = _getFrontMatter(relPath);

    return Object.assign({}, fileContext, frontMatter);
}//_getPageContext()

function forFile (relPath) {
    return {
        _: _,
        site: CONFIG.site,
        data: _getDataContext(),
        page: _getPageContext(relPath),
        VERSION: PKG.version,
    };
}//forFile

exports.forFile = forFile;
