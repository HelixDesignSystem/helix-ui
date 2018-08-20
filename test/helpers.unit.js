const jsdom = require('jsdom');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

global.window = new jsdom.JSDOM().window;
// global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.sinon = sinon;
global.expect = expect;