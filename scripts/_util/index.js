'use strict';

/*
 * Wraps node apis in promises so that they can be used
 * in async/await logic.
 */

const cp = require('child_process');
const fs = require('fs');
const { promisify } = require('util');

exports.writeFile = promisify(fs.writeFile);
exports.readFile = promisify(fs.readFile);
exports.exec = promisify(cp.exec);
