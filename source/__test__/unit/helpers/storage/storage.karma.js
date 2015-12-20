var buildPath = '../../../../../build/';

module.exports = function(config) {
    config.set({
        browsers: ['Chrome', 'Firefox'],
        frameworks: ['mocha', 'chai'],
        hostname: 'testing.squard.com',
        basePath: './',
        files: [
            buildPath + 'js/bower/requirejs/require.js',
            buildPath + 'js/helpers/storage.js',
            buildPath + 'js/bower/jquery/dist/jquery.js',
            './*.spec.js'
        ],
        FOCUS: true
    });
};
