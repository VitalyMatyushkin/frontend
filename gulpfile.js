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
gulp.task('amd_scripts', function(){
	return amd_scrtipts(SOURCE + '/js/module/**/*.js');
});

function amd_scrtipts(path){
	var files = gulp.src(path);

	files = files.pipe(react()).pipe(gulp.dest(BUILD + '/js/module'));
	files = files.pipe(requireConvert());
	files = files.pipe(gulp.dest(BUILD + '/js/module'));

	files = files.pipe(connect.reload());

	return files;
}

// Config and main script files
gulp.task('main_scripts', function (path) {
	return main_scripts(SOURCE + '/js/*.js');
});

function main_scripts(path) {
	var files = gulp.src(path);

	files = files.pipe(concat('main.js'));
	files = files.pipe(gulp.dest(BUILD + '/js'));
	files = files.pipe(connect.reload());

	return files;
}


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

gulp.task('test', function() {
	console.log(arguments)
});


// Run build
gulp.task('default', function (callback) {
	run('connect', 'clean', 'styles', 'bower', 'main_scripts', 'amd_scripts', 'svg_symbols', callback);

	gulp.watch(SOURCE + '/styles/**/*.scss', function(event) {
		gulp.run('styles');
	});

	gulp.watch(SOURCE + '/js/*.js', function(event) {
		main_scripts(event.path);
	});

	gulp.watch(SOURCE + '/js/module/**/*.js', function(event) {
		amd_scrtipts(event.path);
	});
});