import { readFile, readFileSync } from 'fs-extra';
import { rootDir } from '../config';

const wcjsDir = `${rootDir}/node_modules/@webcomponents/webcomponentsjs`;

function _readAsString (filePath) {
    let content = '';
    try {
        content = readFileSync(filePath).toString();
    } catch (e) {
        console.log(`ERROR fetching ${filePath} contents:`);
        console.error(e.message);
    }
    return content;
}

// "cache" file contents to prevent further IO blocking
const LICENSE = _readAsString(`${rootDir}/LICENSE`);
const ES5_ADAPTER = _readAsString(`${wcjsDir}/custom-elements-es5-adapter.js`);

// See https://rollupjs.org/guide/en/#outputbanneroutputfooter
export function getBanner(opts={}) {
    let cfg = {
        es5adapter: true,
        ...opts,
    };

    let parts = [];

    /* ===== 3rd-party Assets ===== */

    // custom-elements-es5-adapter.js
    if (cfg.es5adapter) {
        parts.push(ES5_ADAPTER);
    }

    /* ===== LICENSE ===== */
    parts.push(`/*! @license @nocompile\n${LICENSE}*/`);

    let banner = parts.join('\n');

    return banner;
}
