const HelixUI = require('./index');
const PKG = require('../../package.json');

describe('helix-ui', function () {
    it('it should have correct version', () => {
        expect(HelixUI.VERSION).to.equal(PKG.version);
    });
});