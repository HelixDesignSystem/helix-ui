/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        //{ pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
        { pattern:
            config.grep ? config.grep : 'dist/js/helix-ui.js',
            type: 'js'
        },
        { pattern:
            config.grep ? config.grep : 'dist/js/helix-ui.module.js',
            type: 'module'
        },
        { pattern:
            config.grep ? config.grep : 'src/elements/**/*.spec.js',
            type: 'module'
        },
      ],
      esm: {
        nodeResolve: true,
        compatibility: "max",
        moduleDirs: ['node_modules', 'dist'],
      },
      proxies: {
        //   "/src/": "/base/src/",
        //   "/dist/js/": "/base/dist/js/",
      },
      middlewares: [
        // attempted to add routes here
      ],
      // you can overwrite/extend the config further
      polyfillsLoader: {
          polyfills: {
            webcomponents: true,
            shadyCssCustomStyle: true,
          },
      },
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: config.LOG_INFO,
    }),
  );
  return config;
};
