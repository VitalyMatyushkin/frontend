/**
 * Created by wert on 22.12.15.
 */

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'/*, 'Firefox'*/],
        frameworks: ['requirejs'/* 'mocha', 'chai'*/],
        hostname: 'testing.squard.com',
        //basePath: './',
        basePath: '../../',
        files: [
            {
                pattern: 'build/js/bower/**/*.js',
                included: false
            },
            {
                pattern: 'build/js/module/**/*.js',
                included: false
            },
            {
                pattern: 'source/__test__/unit/helpers/storage/*.spec.js',
                included: false
            },
            "source/__test__/unit/helpers/storage/main_test.js"

        ],
        FOCUS: true,

    });
};
