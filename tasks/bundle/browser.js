import { parallel, task } from 'gulp';
import { rollup } from 'rollup';
import { argv } from 'yargs';

import { pkg, srcDir, distDir } from '../config';
import { getBanner } from '../rollup';

import { terserPlugin, es5plugins, es6plugins } from '../rollup/plugins';

const outDir = `${distDir}/js`;
const OUTPUT = {
    banner: getBanner({
        es5adapter: true
    }),
};

export const gulpFlags = {
    '--prod': 'generate additional minified bundles'
};


/**
 * Generate IE-compatible browser bundles
 *
 * Syntax:       ES5
 * Module:       UMD
 * package.json: "unpkg"
 *
 * @example
 * <script [nomodule] src="..."></script>
 */
export async function browserUMD () {
    const inputOpts = {
        input: `${srcDir}/_bundle.es5.js`,
        plugins: es5plugins,
    };

    const outputOpts = {
        ...OUTPUT,
        file: pkg.unpkg,
        format: 'umd',
        name: 'HelixUI',
        sourcemap: false,
    };

    /* ----- generate unminified asset ----- */
    let fullBundle = await rollup(inputOpts);
    let promiseFull = fullBundle.write(outputOpts);

    /* ----- generate minified asset ----- */
    let promiseMin = Promise.resolve();
    if (argv.prod) {
        let minBundle = await rollup({
            ...inputOpts,
            plugins: [
                ...inputOpts.plugins,
                terserPlugin,
            ],
        });

        promiseMin = minBundle.write({
            ...outputOpts,
            file: `${outDir}/helix-ui.min.js`,
        });
    } else {
        console.info('skip minified UMD bundle')
    }

    return Promise.all([
        promiseFull,
        promiseMin,
    ]);
}
browserUMD.description = 'Generate UMD browser bundles';
browserUMD.flags = gulpFlags;
task('bundle:browser:UMD', browserUMD);


/**
 * Generate evergreen browser bundles
 *
 * Syntax:       ES6/ES2015
 * Module:       ESM
 * package.json: "main"
 *
 * @example
 * <script type="module" src="..."></script>
 */
export async function browserESM () {
    const inputOpts = {
        input: `${srcDir}/_bundle.es6.js`,
        plugins: es6plugins,
    };

    const outputOpts = {
        ...OUTPUT,
        file: `${outDir}/helix-ui.module.js`,
        format: 'esm',
        banner: getBanner({
            es5adapter: false
        }),
    };

    /* ----- generate unminified asset ----- */
    let fullBundle = await rollup(inputOpts)
    let promiseFull = fullBundle.write(outputOpts);

    /* ----- generate minified asset ----- */
    let promiseMin = Promise.resolve();
    if (argv.prod) {
        let minBundle = await rollup({
            ...inputOpts,
            plugins: [
                ...inputOpts.plugins,
                terserPlugin,
            ],
        });

        promiseMin = minBundle.write({
            ...outputOpts,
            file: `${outDir}/helix-ui.module.min.js`,
        });
    } else {
        console.log('skip minified browser ESM bundle')
    }

    return Promise.all([
        promiseFull,
        promiseMin,
    ]);
}
browserESM.description = 'Generate ESM browser bundles';
browserESM.flags = gulpFlags;
task('bundle:browser:ESM', browserESM);


/**
 * Generate all browser-consumable bundles
 */
export const bundleBrowsers = parallel(
    'bundle:browser:UMD',
    'bundle:browser:ESM',
);
bundleBrowsers.description = 'Generate all browser bundles';
bundleBrowsers.flags = gulpFlags;
task('bundle:browsers', bundleBrowsers);
