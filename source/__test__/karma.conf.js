module.exports = function(config) {
  config.set({
    browsers: ['Chrome', 'Firefox'],
    frameworks: ['mocha', 'chai'],
    basePath: '.',
    files: [
      //'../js/**/*.js',
      './**/*.spec.js'
    ]
  });
};
