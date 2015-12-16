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
	babel = require("gulp-babel"),
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
	return gulp.src(TEST_SOURCE + "/**/*.karma.js")
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

	/** recursively traverse array and perform doKarma() on each element.
	 * This trick allow to start new Karma instance only when previous is down
	 */
	function run(arr) {
		var step = arr.shift();	// Note: it will be better to use immutable version here, but this works too
		if(step) {				// there are still items to process
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

/** Set few details to make build easier */
gulp.task('normalize', function () {
	var fs = require('fs'),
		reactPath = './source/js/bower/react/.bower.json',
		reactJSON = require(reactPath),
		moreartyPath = './source/js/bower/moreartyjs/.bower.json',
		moreartyJSON = require(moreartyPath);

	if (reactJSON.main !== 'react-with-addons.js') {
		reactJSON.main = 'react-with-addons.js';
		fs.writeFile(reactPath, JSON.stringify(reactJSON, null, 4));
	}

	moreartyJSON.main = 'dist/morearty.js';
	fs.writeFile(moreartyPath, JSON.stringify(moreartyJSON, null, 4));
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
	return buildToAmdScripts(SOURCE + '/js/module/**/*.js');
});

/** compiles React's JSX to JS, wraps CommonJS modules to AMD, stores result to BUILD/js/modules */
function buildToAmdScripts(path){
	return gulp.src(path)						// picking everything from path
		.pipe(gulpif(VERBOSE, using({})))		// printing all files picked in case of VERBOSE
		.pipe(babel())							// converting JSX to JS and some parts of ES6 to ES5
		.pipe(requireConvert())					// converting CommonJS modules to AMD modules
		.pipe(gulp.dest(BUILD + '/js/module'))	// saving again
		.pipe(connect.reload());				// reloading connect
}


/** Moving all files from source/js to build/js withoud doing anything. Directories not affected */
gulp.task('moveCoreScripts', function(){
	return gulp.src(SOURCE + '/js/*.js')
		.pipe(babel())						// some ES6 magic to people
		.pipe(gulp.dest(BUILD + '/js'));
});

gulp.task('moveBowerScripts', ['moveMainBowerScripts', 'moveAdditionalBowerScripts']);

/** Moving all main files from bower deps */
gulp.task('moveMainBowerScripts', function(){
	return gulp.src(bower({checkExistence: true}), { base: SOURCE + '/js/bower' })
			.pipe(gulp.dest(BUILD + '/js/bower'));
});

/** Moves react-dom which is not main bower file */
gulp.task('moveAdditionalBowerScripts', function(){
	return gulp.src(SOURCE + '/js/bower/react/react-dom.js')
			.pipe(gulp.dest(BUILD + '/js/bower/react'));
});

/** Just deletes BUILD folder */
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
	run('clean', 'lint', 'connect', 'styles', 'moveBowerScripts', 'moveCoreScripts', 'amd_scripts', 'svg_symbols', callback);

	gulp.watch(SOURCE + '/styles/**/*.scss', function(event) {
		console.log('STYLES RELOAD');
		gulp.run('styles');
	});

	gulp.watch(SOURCE + '/js/*.js', function(event) {
		console.log('MAIN SCRIPTS RELOAD');
		gulp.run('moveCoreScripts');
	});

	gulp.watch([SOURCE + '/js/module/**/*.js', SOURCE + '/js/module/*.js'], function(event) {
		console.log('AMD SCRIPTS RELOAD');
		run('clean_amd', 'amd_scripts');
	});
});

gulp.task('deploy', function (callback) {
    run('clean', 'lint', 'styles', 'normalize', 'moveBowerScripts', 'moveCoreScripts', 'amd_scripts', 'svg_symbols', callback);
});