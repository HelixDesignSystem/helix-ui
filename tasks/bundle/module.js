import { parallel, task } from 'gulp';
import { rollup } from 'rollup';

import { pkg, srcDir } from '../config';
import { es5plugins } from '../rollup/plugins';
import { getBanner } from '../rollup';

const INPUT = {
    input: `${srcDir}/_bundle.es5.js`,
    plugins: es5plugins,
};

const OUTPUT = {
    banner: getBanner({
        es5adapter: true,
    }),
};

/**
 * Generate CJS module bundle
 *
 * Syntax:       ES5
 * Module:       CJS
 * package.json: "main"
 */
export async function moduleCJS () {
    let bundle = await rollup(INPUT);

    return bundle.write({
        ...OUTPUT,
        file: pkg.main,
        format: 'cjs',
    });
}
moduleCJS.description = 'Generate modules compatible with legacy bundlers';
task('bundle:module:CJS', moduleCJS);


/**
 * Generate ESM module bundle
 *
 * Syntax:       ES5
 * Module:       ESM
 * package.json: "module"
 *
 * NOTE: ESM bundle will become unnecessary once we begin
 * shipping individual files for deep-module importing.
 */
export async function moduleESM () {
    let bundle = await rollup(INPUT);

    return bundle.write({
        ...OUTPUT,
        file: pkg.module,
        format: 'esm',
    });
}
moduleESM.description = 'Generate modules compatible with modern bundlers';
task('bundle:module:ESM', moduleESM);


/**
 * Generate all bundler-consumable bundles
 */
export const bundleModules = parallel(
    'bundle:module:CJS',
    'bundle:module:ESM',
);
bundleModules.description = 'Generate all module bundles';
task('bundle:modules', bundleModules);
