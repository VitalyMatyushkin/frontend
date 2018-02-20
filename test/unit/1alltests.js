/**
 * Created by wert on 17.02.2018
 */

/** performing global configuration for promises. Once for all tests */

const BPromise = require('bluebird');
BPromise.config({
	warnings:			true,
	longStackTraces:	true,
	cancellation:		true,
	monitoring:			true
});

/**
 * This is how we are importing all files in this directory and deeper at once.
 * Check docs here: https://webpack.js.org/guides/dependency-management/
 * There is also example here: https://github.com/gabel/karma-webpack-example/blob/master/test/test.js
 */
const testContext = require.context('.', true, /\.(js|ts|tsx|json)$/);
testContext.keys().forEach(testContext);
