'use strict';

const CONFIG = require('../_config');
const Context = require('./context');
const Nunjucks = require('./nunjucks');
const fm = require('front-matter');
const fs = require('fs');
const globby = require('globby');
const path = require('path');

/*
 * Ensure that path is to .html file. This is the location of the file
 * relative to the public directory.
 *
 * _getHtmlPath('components/icon/index.html'); // 'components/icon/index.html'
 * _getHtmlPath('components/foo/index.md'); // 'components/foo/index.html'
 */
function _getHtmlPath (relPath) {
    return path.format({
        dir: path.dirname(relPath),
        name: path.basename(relPath, path.extname(relPath)),
        ext: '.html'
    });
}//_getHtmlPath

function _readWithContext (relPath, next) {
    const ctx = Context.forFile(relPath);

    ctx.path = _getHtmlPath(relPath);

    fs.readFile(`${CONFIG.docsDir}/${relPath}`, 'utf8', (err, data) => {
        if (err) {
            next(err);
        } else {
            const nextFile = {
                path: relPath,
                content: (fm.test(data) ? fm(data).body : data)
            };

            next(err, nextFile, ctx);
        }
    });
}//_readWithContext

function renderEach (globs, next) {
    const markupFiles = globby.sync(globs, {
        cwd: CONFIG.docsDir
    });

    markupFiles.forEach(relPath => {
        _readWithContext(relPath, (err, file, ctx) => {
            if (err) {
                next(err);
            } else {
                Nunjucks.renderString(file.content, ctx, (err, renderedContent)=> {
                    if (err) {
                        next(err);
                    } else {
                        let nextFile = {
                            path: file.path, // *.html converted path
                            content: renderedContent // rendered content
                        };

                        next(err, nextFile, ctx);
                    }
                });
            }
        });
    });
}//renderEach

exports.renderEach = renderEach;
