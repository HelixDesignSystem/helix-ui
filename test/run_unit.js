require = require('esm')(module);
const jsdom = require('jsdom'); // Needed for DOM API testing
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

global.window = new jsdom.JSDOM().window; // Needed for DOM API testing
global.HTMLElement = window.HTMLElement;
global.sinon = sinon;
global.expect = expect;

// Add Tests Here
require('../src/helix-ui/utils/index.spec');