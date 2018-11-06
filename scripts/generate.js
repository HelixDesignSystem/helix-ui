#!/usr/bin/env node
'use strict';

const { copyDocs, copyDist } = require('./_util/copy');
const { generateAll } = require('./_generate');

(function () {
    copyDist();
    copyDocs();
    generateAll();
})();
