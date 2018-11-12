const buildIcons = require('./buildIcons');
const buildTemplates = require('./buildTemplates');

/**
 * Build ES5-compatible assets in lib/*
 * @async
 */
async function buildAll () {
    await Promise.all([
        buildIcons(),
        buildTemplates(),
    ]);
}

module.exports = {
    buildAll,
    buildIcons,
    buildTemplates,
};
