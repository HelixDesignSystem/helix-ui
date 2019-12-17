/**
 * Create _tmp/*.tgz files
 */
import { parallel } from 'gulp';
import { archiveHelixUI } from './helix-ui';
import { archiveIcons } from './icons';

// FYI: requires `gulp bundle --prod`
const archive = parallel(
    archiveHelixUI,
    archiveIcons,
);

export {
    archive,
    archiveHelixUI,
    archiveIcons,
};
