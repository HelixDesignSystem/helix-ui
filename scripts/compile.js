#!/usr/bin/env node
'use strict';

const { compileAll } = require('./_compile');

console.log(typeof compileAll);

(function () {
    compileAll();
})();
