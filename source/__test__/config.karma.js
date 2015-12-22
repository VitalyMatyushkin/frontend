/**
 * Created by wert on 22.12.15.
 */

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'/*, 'Firefox'*/],
        frameworks: ['requirejs', 'mocha', 'chai'],
        hostname: 'testing.squard.com',
        //basePath: './',
        basePath: '../../',
        files: [
            {
                pattern: "build/js/**/*.js",
                included: false
            },
            {
                pattern: "build_test/**/*.js",
                included: false
            },

            "source/__test__/main_test.js"
        ],
        singleRun: true
    });
};
