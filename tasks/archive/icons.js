import { src, dest } from 'gulp';
import tar from 'gulp-tar';
import path from 'path';

import {
    pkg,
    pubDir,
    site as siteCfg,
    srcDir,
    tmpDir,
} from '../config';

// what to include in the tarball
const GLOBS = [
    'LICENSE',
    `${srcDir}/images/icons/*.svg`,
];
// path of generated tarball (relative to project root)
const FILEPATH = `${tmpDir}/${pkg.name}-${pkg.version}-icons.tgz`;
// where to build tarball contents
const TMP_DIR = `${tmpDir}/icons`;
// name of tarball (sans directory paths)
const FILENAME = path.basename(FILEPATH);
// where to place the tarball
const DEST_DIR = path.dirname(FILEPATH);

async function archiveIcons () {
    return src(GLOBS)
        .pipe(dest(TMP_DIR))
        .pipe(tar(FILENAME, { gzip: true }))
        .pipe(dest(DEST_DIR))
}

export {
    FILEPATH,
    archiveIcons,
};
