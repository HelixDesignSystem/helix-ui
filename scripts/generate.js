#!/usr/bin/env node
'use strict';

const { copyDocs, copyDist } = require('./_util/copy');
const { generateAll } = require('./_generate');

(async function () {
    await copyDist();
    await copyDocs();
    await generateAll();
})();
