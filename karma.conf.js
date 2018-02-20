/**
 * Created by wert on 22.12.15.
 *
 */


/**
 * Note, there is an error in Karma 2.x which prevents from correct stack trace printing when using source maps
 * This is discussed here: https://github.com/karma-runner/karma/issues/2930
 * Hope it will be fixed soon.
 */


const webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
		autoWatch: true,
        frameworks: ['mocha'],
        hostname: 'localhost',
        basePath: '',
        files: [
			// each file acts as entry point for the webpack configuration
        	'test/unit/1alltests.js'
        ],
		preprocessors: {
			'test/unit/**.js':	['webpack', 'sourcemap'],
			'test/unit/**.ts':	['webpack', 'sourcemap'],
			'test/unit/**.tsx':	['webpack', 'sourcemap']
		},
		reporters: ['mocha'],
		webpack: {
			module: {
				...webpackConfig.module,
				// Suppress warning from mocha: "Critical dependency: the request of a dependency is an expression"
				// @see https://webpack.js.org/configuration/module/#module-contexts
				exprContextCritical: false,
			},
			resolve: webpackConfig.resolve,
			// Suppress fatal error: Cannot resolve module 'fs'
			// @relative https://github.com/pugjs/pug-loader/issues/8
			// @see https://github.com/webpack/docs/wiki/Configuration#node
			node: {
				fs: 'empty',
			},
			devtool: 'inline-source-map'
		},
		client: {
        	captureConsole: true,
			mocha: {
        		timeout: 5000
			}
		}
		// logLevel: config.LOG_DEBUG
		// singleRun: true
    });
};
