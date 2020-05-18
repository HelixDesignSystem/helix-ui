/* eslint-env node */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

const customLaunchers = {
	mac_firefox: {
		base: 'SauceLabs',
		browserName: 'firefox',
        platform: 'OS X 10.13',
        version: 'latest-1'
	},
	mac_safari: {
		base: 'SauceLabs',
		browserName: 'safari',
        platform: 'OS X 10.13',
        version: 'latest-1'
	},
	mac_chrome: {
		base: 'SauceLabs',
		browserName: 'chrome',
        platform: 'OS X 10.13',
        version: 'latest-1'
	},
	win_edge_legacy: {
		base: 'SauceLabs',
		browserName: 'microsoftedge',
		platform: 'Windows 10',
		version: '18.17763'
    },
    win_10_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.285',
    },
	// win_edge_chromium: { // Current SL config only allows 5 browsers per test run
	// 	base: 'SauceLabs',
	// 	browserName: 'microsoftedge',
	// 	platform: 'Windows 10',
	// 	version: 'latest'
	// },
};

module.exports = config => {
	config.set(
		merge(createDefaultConfig(config), {
			files: [
				// runs all files ending with .test in the test folder,
				// can be overwritten by passing a --grep flag. examples:
				//
				// npm run test -- --grep test/foo/bar.test.js
                // npm run test -- --grep test/bar/*
                { pattern: 'karma-sauce-init.js',
                  type: 'module'
                },
                { pattern: config.grep ? config.grep : 'src/elements/**/*.spec.js',
                  type: 'module'
                },
            ],
			// see the karma-esm docs for all options
			esm: {
				// if you are using 'bare module imports' you will need this option
				nodeResolve: true,
                compatibility: 'max',
                moduleDirs: ['node_modules', 'dist'],
            },
			sauceLabs: {
				testName: 'HelixUI Component Unit Tests',
                public: "public restricted",
                recordVideo: false,
                recordLogs: false,
			},
			customLaunchers: customLaunchers,
			browsers: Object.keys(customLaunchers),
			reporters: ['dots', 'saucelabs'],
			singleRun: true,
			browserDisconnectTimeout : 120000, // default 2000
			browserDisconnectTolerance : 10, // default 0
			browserNoActivityTimeout: 120000, // default 10000
			captureTimeout: 120000, // default 60000
            concurrency: 5,
			client: {
				mocha: {
					timeout : 10000
				}
            },
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
