import path from 'path';

export * as pkg from '../package.json';

/* ===== PATHS ===== */
export const rootDir = path.resolve(__dirname, '..'); // absolute path to project directory
export const distDir = 'dist';
export const docsDir = 'docs'
export const pubDir = 'public';
export const srcDir = 'src';
export const testDir = 'test';

// Component Explorer Docs Configuration
// Used directly for "site" rendering context
export const site = {
    title: 'HelixUI',
    language: 'en',
    baseHref: '/helix-ui/',
    // Moment.js format string
    dateFormat: 'YYYY-MM-DD',
    // Moment.js format string
    timeFormat: 'HH:mm:ss',
};

// Configuration for the LESS precompiler
export const less = {
    paths: [
        `${docsDir}/styles`,
        `${srcDir}/less`
    ],
};

export const sass = {
    includePaths: [
        `${srcDir}/scss`
    ],
    precision: 4,
};

