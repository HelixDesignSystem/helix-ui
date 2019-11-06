// TODO: add --prod flag support to avoid minifying in dev mode
import CleanCSS from 'clean-css';
import LESS from 'less';
import SASS from 'node-sass';
import path from 'path';
import { parallel, task } from 'gulp';
import { ensureDir, readFile, writeFile } from 'fs-extra';

import {
    distDir,
    less as lessCfg,
    rootDir,
    sass as sassCfg,
    srcDir,
} from '../config';

const cssMinifier = new CleanCSS({
    advanced: true,
});

/**
 * @see http://lesscss.org/usage/#programmatic-usage
 * @returns {object}
 * metadata object with 'css' and 'min' props whose
 * values are CSS stylesheet strings
 */
async function _lessToCSS () {
    let inFile = `${srcDir}/less/index.less`;

    let srcContent = await readFile(inFile, 'utf-8');

    let rendered = {};
    try {
        rendered = await LESS.render(srcContent, {
            paths: lessCfg.paths.map((filepath) => {
                return path.join(rootDir, filepath);
            }),
            filename: path.basename(inFile),
            rewriteUrls: true,
        });
    } catch (err) {
        console.error(`[ERROR: _lessToCSS()] ${err.message}`);

        let cssMsg = `/* (LESS-to-CSS) ERROR: ${err.message} */`
        return {
            css: cssMsg,
            min: cssMsg,
        };
    }

    let minified = cssMinifier.minify(rendered.css);

    return {
        css: rendered.css,
        min: minified.styles
    };
}


/**
 * @see https://sass-lang.com/documentation/js-api
 * @returns {object}
 * metadata object with 'css' and 'min' props whose
 * values are CSS stylesheet strings
 */
async function _sassToCSS () {
    let rendered;

    // SASS -> CSS (full)
    try {
        rendered = await SASS.renderSync({
            ...sassCfg,
            file: `${srcDir}/scss/index.scss`,
            outputStyle: 'expanded',
        });
    } catch (err) {
        // failed render
        console.error(`[ERROR: _sassToCSS()] ${err.formatted}`);

        let cssMessage = `/* (SASS-to-CSS) ERROR: ${err.formatted} */`;
        return {
            css: cssMessage,
            min: cssMessage,
        };
    }

    // successful render

    let css = rendered.css.toString();

    // CSS (full) -> CSS (minified)
    let minified = cssMinifier.minify(css);

    return {
        css,
        min: minified.styles,
    };
}


export async function writeCSS () {
    let outDir = `${distDir}/css`;

    let scssData = await _sassToCSS();
    let lessData = await _lessToCSS();

    let devCss = scssData.css + lessData.css;
    let prodCss = scssData.min + lessData.min;

    await ensureDir(outDir);
    await Promise.all([
        writeFile(`${outDir}/helix-ui.css`, devCss),
        writeFile(`${outDir}/helix-ui.min.css`, prodCss),
    ]);
}
writeCSS.description = 'Write combined LESS-compiled CSS with SASS-compiled CSS';
task('bundle:style:css', writeCSS);


export const bundleStyles = parallel(
    'bundle:style:css',
);
bundleStyles.description = 'Generate CSS assets';
task('bundle:styles', bundleStyles);
