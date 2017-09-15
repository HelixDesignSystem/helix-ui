'use strict';

const CONFIG = require('../_config');
const Markup = require('./markup');
const fs = require('fs');
const fsx = require('fs-extra');
const path = require('path');

function compileSync () {
    Markup.renderEach(CONFIG.docs.files, (err, file)=> {
        if (err) {
            throw err;
        }

        let destPath = `${CONFIG.publicDir}/${file.path}`;
        fsx.ensureDirSync(path.dirname(destPath));
        fs.writeFileSync(destPath, file.content);
    });
}//compileSync()

exports.compileSync = compileSync;
