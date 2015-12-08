/**
 * Created by wert on 08.12.15.
 */
module.exports = function(config) {
    config.set({
        browsers: ['Chrome', 'Firefox'],
        frameworks: ['mocha', 'chai'],
        hostname: 'testing.squard.com',
        basePath: '.',
        files: [
            //'../../../../js/bower/require',
            //'../../../../js/helpers/storage.js',
            //'./*.spec.js',
            //'../../../../js/bower/jquery/dist/jquery.js'
        ]
    });
};
