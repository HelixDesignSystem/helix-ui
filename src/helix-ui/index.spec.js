//import * as HelixUI from 'helix-ui';

const HelixUI = require('helix-ui');
const jsdom = require("jsdom");
const sinon = require('sinon');
global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

describe('helix-ui', function() {
    it('it should define initialize', () => {
        let initilaizeSpy = sinon.spy(HelixUI.initialize);
        expect(initilaizeSpy).to.have.been.calledOnce;
    });
});