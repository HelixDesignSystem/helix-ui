#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * @fileOverview Script to copy Helix assets (CSS and JS and webcomponent polyfills) from
 *   node_modules to destination folder (defaults to public/assets)
 *
 *   NOTE: This script require Node.js 8.5 or later
 *
 */
const chalk = require("chalk");
const fs = require("fs-extra");
const glob = require("glob");
const UglifyJS = require("uglify-es");

const argv = require("yargs")
    .usage("Usage: $0 -o [str]")
    .alias('o', 'output')
    .describe('o', 'Destination folder')
    .default("o", "public/assets").argv;

const DEST_FOLDER = argv.o;
const WEBCOMPONENT_BUNDLES_FOLDER = `${DEST_FOLDER}/bundles`;
const TARGET_FOLDERS = [DEST_FOLDER, WEBCOMPONENT_BUNDLES_FOLDER];

// Specify a mapping of static assets to copy from the node_modules folder,
//   with each asset source folder as the key, and file options (with files to copy) as the value.
const STATIC_ASSETS = {
    "helix-ui/dist/styles": {
        files: ["helix-ui.css", "helix-ui.min.css"]
    },
    "helix-ui/dist/scripts": {
        files: ["helix-ui.browser.js", "helix-ui.browser.min.js"]
    },
    "@webcomponents/webcomponentsjs": {
        files: [
            "custom-elements-es5-adapter.js",
            "webcomponents-bundle.js",
            "webcomponents-loader.js"
        ],
        filePatterns: [
            // File patterns use glob syntax via node-glob
            "bundles/webcomponents-*.js"
        ],
        // Avoid minifying for now to safely init dynamically loaded webcomponent dependencies
        minify: false
    }
};

// Ensure dest folders exist prior to copying assets
TARGET_FOLDERS.forEach(folder => {
    fs.ensureDirSync(folder);
});

const copyFile = (src, filename) => {
    const dest = `${DEST_FOLDER}/${filename}`;

    try {
        fs.copyFileSync(src, dest);
        console.log(chalk.green(`Copied ${src} to ${dest}`));
    } catch (err) {
        console.log(chalk.red(`ERROR: Unable to copy ${src} to ${dest}`));
        throw err;
    }
};

const minifyFile = (src, filename) => {
    const destFilename = filename.replace(".js", ".min.js");
    const dest = `${DEST_FOLDER}/${destFilename}`;
    const fileSource = fs.readFileSync(src, { encoding: "utf8" });
    const minifiedResult = UglifyJS.minify(fileSource);

    try {
        fs.writeFileSync(dest, minifiedResult.code);
        console.log(chalk.green(`Minified and copied ${src} to ${dest}`));
    } catch (err) {
        console.log(
            chalk.red(`ERROR: Unable to minify and copy ${src} to ${dest}`)
        );
        throw err;
    }
};

const checkMinification = (fileOptions, filename) => {
    // Avoid minifying files already minified and ignore .js.map files
    return !!(
        fileOptions.minify &&
        !filename.includes(".min.js") &&
        !filename.includes(".map")
    );
};

// Copy (and optionally minify) assets
Object.entries(STATIC_ASSETS).forEach(([srcFolder, fileOptions]) => {
    srcFolder = `node_modules/${srcFolder}`;

    let filesToCopy = [];

    fileOptions.files.forEach(filename => {
        filesToCopy.push(filename);
    });

    fileOptions.filePatterns &&
        fileOptions.filePatterns.forEach(pattern => {
            const files = glob.sync(pattern, { cwd: srcFolder });
            files.forEach(filename => {
                filesToCopy.push(filename);
            });
        });

    filesToCopy.forEach(filename => {
        const src = `${srcFolder}/${filename}`;
        copyFile(src, filename);

        // Minify and write file(s) if 'minify' option is enabled
        if (checkMinification(fileOptions, filename)) {
            minifyFile(src, filename);
        }
    });
});
