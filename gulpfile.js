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
	react = require('gulp-react'),
	connect = require('gulp-connect'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	requireConvert = require('gulp-require-convert');

// SVG Symbols generation
gulp.task('svg_symbols', function () {
	var files = gulp.src('./images/icons/*.svg');

	files = files.pipe(svgmin());
	files = files.pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon_' }));
	files = files.pipe(gulp.dest(BUILD + '/images'));

	return files;
});

// Bower dependences
gulp.task('bower', function() {
	var files = gulp.src(bower({checkExistence: true}), { base: '/bower_components' });

	files = files.pipe(concat('bower.js'));
	files = files.pipe(gulp.dest(BUILD + '/js'));

	return files;
});

// Styles generation
gulp.task('styles', function (callback) {
	var files = gulp.src(SOURCE + '/styles/**/*.scss');

	files = files.pipe(sourcemaps.init());
	files = files.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }));
	files = files.pipe(concat('build.css'));
	files = files.pipe(gulp.dest(BUILD + '/styles')).pipe(sass());
	files = files.pipe(gulp.dest(BUILD + '/styles'));
	files = files.pipe(connect.reload());

	return files;
});

// AMD script files
gulp.task('amd_scripts', function () {
	var app_files = gulp.src(SOURCE + '/js/module/**/*.js');

	app_files = app_files.pipe(react()).pipe(gulp.dest(BUILD + '/js/module'));
	app_files = app_files.pipe(connect.reload());

	return app_files;
});

// Config and main script files
gulp.task('main_scripts', function () {
	var main_files = gulp.src(SOURCE + '/js/*.js');

	main_files = main_files.pipe(concat('main.js'));
	main_files = main_files.pipe(gulp.dest(BUILD + '/js'));
	main_files = main_files.pipe(connect.reload());

	return main_files;
});

gulp.task('common_js', function(){
	var files = gulp.src(BUILD + '/js/module/**/*.js');

	files = files.pipe(requireConvert());
	files = files.pipe(gulp.dest(BUILD + '/js/module'));

	return files;
});

// Clean build
gulp.task('clean', function (callback) {
	return gulp.src(BUILD, {read: false}).pipe(clean());
});

// Live reload
gulp.task('connect', function() {
	connect.server({
		root: '/',
		livereload: true
	});
});

// Run build
gulp.task('default', function (callback) {
	run('connect', 'clean', 'styles', 'bower', 'main_scripts', 'amd_scripts', 'common_js', 'svg_symbols', callback);

	gulp.watch(SOURCE + '/styles/**/*.scss', function(event) {
		gulp.run('styles');
	});

	gulp.watch([SOURCE + '/js/module/**/*.js', SOURCE + '/js/*.js'], function(event) {
		console.log('JS REBUILD');
		gulp.src(BUILD + '/js', {read: false}).pipe(clean());
		run('bower', 'main_scripts', 'amd_scripts', 'common_js', callback);
	});

});