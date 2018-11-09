const Utils = require('./index');

describe('utils', function () {
    it('it should have expected exports', () => {
        expect(Utils.KEYS).to.exist;
    });
});