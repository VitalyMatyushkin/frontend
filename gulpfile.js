var SOURCE = './source',
	BUILD = './build',
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	bower = require('main-bower-files'),
	run = require('run-sequence'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	react = require('gulp-react'),
	connect = require('gulp-connect'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	requireConvert = require('gulp-require-convert'),
	del = require('del'),
	using = require('gulp-using');

// SVG Symbols generation
gulp.task('svg_symbols', function () {
	var files = gulp.src('./images/icons/*.svg');

	files = files.pipe(svgmin());
	files = files.pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon_' }));
	files = files.pipe(gulp.dest(BUILD + '/images'));

	return files;
});

gulp.task('normalize', function (callback) {
	var fs = require('fs'),
		path = './source/js/bower/react/.bower.json',
		json = require(path);

	if (json.main !== 'react-with-addons.js') {
		json.main = 'react-with-addons.js';
		fs.writeFile(path, JSON.stringify(json, null, 4), function(err) {
			if(err) {
				console.log(err);
                callback();
			} else {
				callback();
			}
		});
	}
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
	return amdScrtipts(SOURCE + '/js/module/**/*.js');
});

function amdScrtipts(path){
	var files = gulp.src(path);

	files = files.pipe(using({})).pipe(react()).pipe(gulp.dest(BUILD + '/js/module'));
	files = files.pipe(requireConvert());
	files = files.pipe(gulp.dest(BUILD + '/js/module'));

	files = files.pipe(connect.reload());

	return files;
}

// Config and main script files
gulp.task('main_scripts', function (path) {
	return notAmdScripts(SOURCE + '/js/*.js', 'main.js');
});

// Helpers files
gulp.task('helpers_scripts', function (path) {
	return notAmdScripts(SOURCE + '/js/helpers/*.js', 'helpers.js');
});

function notAmdScripts(path, result) {
	var result = result || 'main.js',
		files = gulp.src(path);

	files = files.pipe(concat(result));
	files = files.pipe(gulp.dest(BUILD + '/js'));
	files = files.pipe(connect.reload());

	return files;
}


// Clean build
gulp.task('clean', function (callback) {
    del([BUILD], callback);
});

// Live reload
gulp.task('connect', function() {
	connect.server({
		root: './',
		livereload: true
	});
});


gulp.task('clean_amd', function (callback) {
	del(BUILD + '/js/module', callback);
});

// Run build
gulp.task('default', function (callback) {
	run('connect', 'clean', 'styles', 'bower', 'main_scripts', 'helpers_scripts', 'amd_scripts', 'svg_symbols', callback);

	gulp.watch(SOURCE + '/styles/**/*.scss', function(event) {
		console.log('STYLES RELOAD');
		gulp.run('styles');
	});

	gulp.watch(SOURCE + '/js/*.js', function(event) {
		console.log('MAIN SCRIPTS RELOAD');
		notAmdScripts(event.path, 'main.js');
	});

	gulp.watch([SOURCE + '/js/module/**/*.js', SOURCE + '/js/module/*.js'], function(event) {
		console.log('AMD SCRIPTS RELOAD');
		run('clean_amd', 'amd_scripts');
	});
});

gulp.task('deploy', function (callback) {
    run('clean', 'styles', 'normalize', 'bower', 'main_scripts', 'helpers_scripts', 'amd_scripts', 'svg_symbols', callback);
});