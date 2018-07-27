#!/usr/bin/env node
'use strict';

const CONFIG = require('../_config');
const express = require('express');
const { exec } = require('child_process');

// Create Express App
const app = express();
app.use('/helix-ui', express.static(CONFIG.publicDir));
app.use('/', express.static(CONFIG.publicDir));

// Start Server
const server = app.listen(3000, () => {
    console.log('Serving http://127.0.0.1:3000');
    console.log('Use CTRL-C to stop the server.');
});

// Start Selenium
const selenium = exec('yarn webdriver:start', { cwd: CONFIG.testDir });
if (selenium) {
    console.log('selenium started');
}

// Cleanup on Exit
process.on('SIGINT', function () {
    console.log('Stopping...');

    // Cleanup Selenium
    if (selenium) {
        selenium.kill();
    }

    // Close Server
    server.close(() => {
        process.exitCode = 1;
    });
});
