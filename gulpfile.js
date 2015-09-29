var SOURCE = './source',
	BUILD = './build',
	TEST_SOURCE = './source/__test__',
	VERBOSE = false,						// set to true if extensive console output during build required
	gulp = require('gulp'),					// gulp itself
	concat = require('gulp-concat'),		// collects content of all files into one file
	gulpif = require('gulp-if'),			// allows to write conditional pipes
	bower = require('main-bower-files'),	// picks only main files of each bower component
	run = require('run-sequence'),			// runs gulp tasks in  _synchronous_ sequence. One by one.
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),	// Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website
	react = require('gulp-react'), 					// precompiles React JSX to JS
	connect = require('gulp-connect'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	requireConvert = require('gulp-require-convert'),	// converts CommonJS modules to AMD
	del = require('del'),					// plugin to delete files/folders
	using = require('gulp-using'),			// gulp.src('*.js').pipe(using({})) will show all files found by '*.js'
	uglify = require('gulp-uglify'),		// minimize js
	eslint = require('gulp-eslint'),
	filenames = require('gulp-filenames'),
	karmaServer = require('karma').Server;

/** This task collect all files which tends to be karma configuration and build array with filenames.
 * This is required for __sync__ processing of each file. In case of async processing (with .pipe() for ex.)
 * multiple Karma instances will be run simultaneously, which will lead to multiple problems, because Karma not
 * suites for multiple launches well.
 *
 * Files collected with 'gulp-filenames' module and can be fetched with 'filenames.get('karma-config-files')'
 * See docs on 'gulp-filenames' for more details.
 */
gulp.task('collect-test-configurations', function(){
	return gulp.src(TEST_SOURCE + "/**/*.conf.js")
		.pipe(filenames('karma-config-files'));
});


/** Run Karma server sequentially for each configuration provided from 'filenames.get('karma-config-files', 'full')'
 */
gulp.task('test', ['collect-test-configurations'], function () {
	/** Will run provided karma conf file and stop */
	function doKarma(fullConfPath, done) {
		new karmaServer({
				configFile: fullConfPath,
				singleRun: true
			},
			done
		).start();
	}

	/** recursively traverse array and perform doKarma() on each element */
	function run(arr) {
		var step = arr.shift();
		if(step) {	// there are still smth to process
			doKarma(step, function(){
				run(arr)
			});
		}
	}

	var fnames = filenames.get('karma-config-files', 'full');
	run(fnames);
	// maybe it should return smth... who knows..

});


gulp.task('lint', function(){
	return gulp.src([SOURCE + '/js/**/*.js', '!' + SOURCE + '/js/bower/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format());
});

// SVG Symbols generation
gulp.task('svg_symbols', function () {
	var files = gulp.src('./images/icons/*.svg');

	files = files.pipe(svgmin());
	files = files.pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon_' }));
	files = files.pipe(gulp.dest(BUILD + '/images'));

	return files;
});

gulp.task('normalize', function () {
	var fs = require('fs'),
		path = './source/js/bower/react/.bower.json',
		json = require(path);

	if (json.main !== 'react-with-addons.js') {
		json.main = 'react-with-addons.js';
		fs.writeFile(path, JSON.stringify(json, null, 4));
	}
});

/** Assembles all bower dependencies to one ./bower.js file and minify it */
gulp.task('bower', function() {
	var files = gulp.src(bower({checkExistence: true}), { base: '/bower_components' });

	files = files.pipe(concat('bower.js'));
	files = files.pipe(uglify());
	files = files.pipe(gulp.dest(BUILD + '/js'));

	return files;
});

/** Building css from scss */
gulp.task('styles', function () {
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

	files = files.pipe(gulpif(VERBOSE, using({}))).pipe(react()).pipe(gulp.dest(BUILD + '/js/module'));
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
	run('lint', 'connect', 'clean', 'styles', 'bower', 'main_scripts', 'helpers_scripts', 'amd_scripts', 'svg_symbols', callback);

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
    run('clean', 'lint', 'styles', 'normalize', 'bower', 'main_scripts', 'helpers_scripts', 'amd_scripts', 'svg_symbols', callback);
});