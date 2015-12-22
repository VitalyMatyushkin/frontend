/**
 * Created by wert on 22.12.15.
 *
 * This is configuration for Karma. Plz consult docs and corresponding main_test.js file for details
 */

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'/*, 'Firefox'*/],
        frameworks: ['requirejs', 'mocha', 'chai'],
        hostname: 'testing.squard.com',
        basePath: '../../',
        files: [
            {
                pattern: "build/js/**/*.js",
                included: false
            },
            "source/__test__/main_test.js"
        ],
        singleRun: true
    });
};
