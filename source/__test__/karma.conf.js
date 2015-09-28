module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai'],
    basePath: '.',
    files: [
      //'../js/**/*.js',
      './**/*.spec.js'
    ]
  });
};
