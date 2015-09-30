module.exports = function(config) {
    config.set({
        browsers: ['Chrome', 'Firefox'],
        frameworks: ['mocha', 'chai'],
        basePath: '.',
        files: [
            '../../../../js/helpers/storage.js',
            './*.spec.js',
            '../../../../js/bower/jquery/dist/jquery.js'
        ]
    });
};
