import HelixUI from './helix-ui/index';
import { version as VERSION } from '../package.json';

HelixUI.VERSION = VERSION;

// add HelixUI to global scope if not already defined
if (!window.HelixUI) {
    window.HelixUI = HelixUI;
}

HelixUI.initialize();
