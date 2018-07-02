import './polyfills/ChildNode';
import './polyfills/Element';
import HelixUI from './helix-ui/index';

// add HelixUI to global scope if not already defined
if (!window.HelixUI) {
    window.HelixUI = HelixUI;
}

// Initialize on load
HelixUI.initialize();
