import { parallel, task } from 'gulp';

import { gulpFlags } from './browser.js';

export * from './styles.js';  // 'bundle:styles'
export * from './browser.js'; // 'bundle:browsers'
export * from './module.js';  // 'bundle:modules'

export const bundleScripts = parallel(
    'bundle:browsers',
    'bundle:modules',
);
task('bundle:scripts', bundleScripts);

export const bundle = parallel(
    'bundle:styles',
    'bundle:scripts',
);
bundle.description = 'Generate bundled assets';
bundle.flags = gulpFlags;
task('bundle', bundle);
