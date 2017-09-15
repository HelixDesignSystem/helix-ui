#!/usr/bin/env node
'use strict';

// See https://github.com/pkgcloud/pkgcloud/blob/master/docs/providers/rackspace/storage.md
// See https://github.com/pkgcloud/pkgcloud/blob/master/lib/pkgcloud/rackspace/storage/client/cdn-containers.js#L178

const Build = require('./build');
const CONFIG = require('../_config');
const Clean = require('./clean');
const fs = require('fs');
const pkgcloud = require('pkgcloud');

const storageClient = pkgcloud.storage.createClient(CONFIG.cdn.storage);

function _upload (client, src, dest) {
    const readStream = fs.createReadStream(src);
    const writeStream = client.upload({
        container: CONFIG.cdn.container,
        remote: dest
    });
    const src2dest = `${src} to ${dest}`;

    writeStream.on('error', function (err) {
        console.error(`FAILED to upload ${src2dest}`);
        console.error(`ERROR: ${err.message}`);
    });

    writeStream.on('success', function (file) {
        console.info(`SUCCESS: Uploaded ${src2dest}`);
    });

    readStream.pipe(writeStream);
}//_upload()

function _afterCdnEnable (err, container) {
    if (err) {
        console.error(`ERROR enabling CDN: ${err.message}`);
        throw err;
    }
    console.log('Container Ready');

    console.log(`Uploading Files to '${CONFIG.cdn.container}'`);
    for (let src in CONFIG.cdn.files) {
        _upload(storageClient, src, CONFIG.cdn.files[src]);
    }
}//_afterCdnEnable()

function deploySync () {
    // Ensure Container Exists
    storageClient.createContainer(CONFIG.cdn.container, (err, container) => {
        console.log('Preparing Container');
        if (err) {
            console.error(`FAILED to create container '${CONFIG.cdn.container}'`);
            console.info(err.message);
            return;
        }
        // Make sure container is CDN enabled
        storageClient.setCdnEnabled(container, true, _afterCdnEnable);
    });
}//deploySync()

exports.deploySync = deploySync;

if (require.main === module) {
    Clean.cleanSync();
    Build.buildSync();
    deploySync();
}
