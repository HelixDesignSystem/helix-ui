/* Legacy/IE Browser bundle entrypoint (ES5 syntax UMD module) */
import './polyfills/index.js'; // Required for IE compatibility
import * as HelixUI from './index.js';

HelixUI.initialize();

export default HelixUI;
