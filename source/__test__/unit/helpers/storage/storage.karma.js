module.exports = function(config) {
    config.set({
        browsers: ['Chrome', 'Firefox'],
        frameworks: ['mocha', 'chai'],
        hostname: 'testing.squard.com',
        basePath: '../../../../../build',
        files: [
            'js/helpers/storage.js',
            'js/bower/jquery/dist/jquery.js',
            './*.spec.js'
        ]
    });
};
