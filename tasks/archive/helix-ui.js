/**
 * dist/** --> {tmpDir}/{pkg.name}-{pkg.version}/** --> {tmpDir}/{pkg.name}-{pkg.version}.tgz
 */
import { ensureDir, readFile, remove, writeFile } from 'fs-extra';
import { dest, parallel, series, src } from 'gulp';
import tar from 'gulp-tar';
import path from 'path';

import { pkg, rootDir, tmpDir } from '../config';


// target destination for the tarball
const FILEPATH = `${tmpDir}/${pkg.name}-${pkg.version}.tgz`;
// where to build tarball contents
const TMP_DIR = `${tmpDir}/package`;
// name of the tarball
const FILENAME = path.basename(FILEPATH); // "{NAME}-{VERSION}.tgz"
// target directory
const DEST_DIR = path.dirname(FILEPATH); // "{tmpDir}"
/*
 * Collect globs for bundled dependency assets
 * (as configured via "bundledDependencies" in package.json)
 */
const BUNDLED = pkg.bundledDependencies.map(dep => `node_modules/${dep}/**/*`);
/*
 * Define globs for all assets to be included in the package.
 * (relative to the root of the project)
 */
const GLOBS = [
    'LICENSE',
    'README.md',
    // extra files
    'dist/**/*', // TODO: use config vars to compose this glob
    ...BUNDLED,
];


async function writePackageJSON () {
    let raw = await readFile(`${rootDir}/package.json`);
    let data = JSON.parse(raw);

    data.files = '*'; // include everything in {TMP_DIR} in the tarball

    // remove unnecessary keys
    delete data.scripts;
    delete data.nyc;

    await ensureDir(TMP_DIR);
    await writeFile(`${TMP_DIR}/package.json`, JSON.stringify(data, null, 2));
}

function copyGlobFiles () {
    return src(GLOBS, { base: '.' })
        .pipe(dest(TMP_DIR));
}


async function _prepare () {
    await remove(TMP_DIR);
    await remove(FILEPATH);
}


/*
 * Package asset bundles into tarball.
 *
 * This is similar to how NPM works via `npm pack`,
 * but it allows us to have more control of the
 * directory structure within the tarball.
 *
 * NOTE: bundles MUST be generated beforehand
 */
function createArchive () {
    return src(`${TMP_DIR}/**/*`)
        .pipe(tar(FILENAME, { gzip: true })) // archive...
        .pipe(dest(DEST_DIR)); // write tarball to destination
}

const collectFiles = parallel(
    copyGlobFiles,
    writePackageJSON,
);

const archiveHelixUI = series(
    _prepare,
    collectFiles,
    createArchive,
);

export {
    FILEPATH,
    archiveHelixUI,
};
