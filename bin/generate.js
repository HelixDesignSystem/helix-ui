#!/usr/bin/env node
'use strict';

const { generateAll } = require('../lib/generate');
const { copyDocs, copyDist } = require('../lib/copy');

(function () {
    copyDist();
    copyDocs();
    generateAll();
})();
