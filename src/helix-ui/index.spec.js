//import * as HelixUI from 'helix-ui';

const HelixUI = require('helix-ui');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const sinon = require('sinon');

describe('helix-ui', function() {
    it('it should define initialize', () => {
        let initilaizeSpy = sinon.spy(HelixUI.initialize);
        expect(initilaizeSpy).to.have.been.calledOnce;
    });
});