var SOURCE = './source',
	BUILD = './build',
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	bower = require('main-bower-files'),
	run = require('run-sequence'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	requirejs = require('gulp-requirejs'),
	react = require('gulp-react');

// Bower dependences
gulp.task('bower', function() {
	var result = gulp.src(bower({checkExistence: true}), { base: '/bower_components' });

	result = result.pipe(concat('bower.js'));
	result = result.pipe(gulp.dest(BUILD + '/js'));

	return result;
});

// Styles generation
gulp.task('styles', function (callback) {
	var result = gulp.src(SOURCE + '/styles/**/*.scss');

	result = result.pipe(sourcemaps.init()).pipe(sass());
	result = result.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }));
	result = result.pipe(concat('build.scss'));
	result = result.pipe(gulp.dest(BUILD + '/styles'));

	return result;
});

// Script files
gulp.task('scripts', function () {
	var result = gulp.src(SOURCE + '/js/**/*.jsx');

	result = result.pipe(react()).pipe(gulp.dest(BUILD + '/js'));

	return result;
});

// Clean build
gulp.task('clean', function (callback) {
	return gulp.src(BUILD, {read: false}).pipe(clean());
});

// Run build
gulp.task('default', function (callback) {
	run('clean', 'styles', 'bower', 'scripts', callback);
});