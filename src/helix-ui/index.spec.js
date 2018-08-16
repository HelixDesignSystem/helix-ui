const jsdom = require('jsdom');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

const HelixUI = require('helix-ui');
describe('helix-ui', function() {
    it('it should define initialize', () => {
        let initializeSpy = sinon.spy(HelixUI.initialize);
        expect(initializeSpy).not.to.have.been.called;
    });
});