require = require('esm')(module);
const chai = require('chai');
const jsdom = require('jsdom'); // Needed for DOM API testing
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const window = new jsdom.JSDOM().window; // Needed for DOM API testing
const expect = chai.expect;

chai.use(sinonChai);

global.window = window;
global.HTMLElement = window.HTMLElement;
global.sinon = sinon;
global.expect = expect;

// Add Tests Here
require('../src/utils/index.spec');
require('../src/elements/HXErrorElement.spec');
