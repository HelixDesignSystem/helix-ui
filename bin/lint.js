#!/usr/bin/env node
'use strict';

// run lint once

// return the return code

// returns 0 its exceeded, anything else fails

// cli return codes

var CLIEngine = require("eslint").CLIEngine;

var cli = new CLIEngine({
    envs: ["browser"],
    fix: true,
    useEslintrc: true,
    rules: {
        semi: 2,
        quotes: [2, "double"]
    }
});

var report = cli.executeOnFiles(["source/", "lib/"]);

if (report.errorCount > 0) {
    throw new Error('Failed with Errors');
} else {
    exit 0;
}
