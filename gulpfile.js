var SOURCE = './source',
	BUILD = './build',
	VERBOSE = false,						// set to true if extensive console output during build required
	gulp = require('gulp'),					// gulp itself
	concat = require('gulp-concat'),		// collects content of all files into one file
	gulpif = require('gulp-if'),			// allows to write conditional pipes
	bower = require('main-bower-files'),	// picks only main files of each bower component
	run = require('run-sequence'),			// runs gulp tasks in  _synchronous_ sequence. One by one.
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),	// Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website
	connect = require('gulp-connect'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	requireConvert = require('gulp-require-convert'),	// converts CommonJS modules to AMD
	del = require('del'),					// plugin to delete files/folders
	using = require('gulp-using'),			// gulp.src('*.js').pipe(using({})) will show all files found by '*.js'
	uglify = require('gulp-uglify'),		// minimize js
	eslint = require('gulp-eslint'),
	filenames = require('gulp-filenames'),
	git = require('gulp-git'),
	fs = require('fs'),
	babel = require("gulp-babel"),
	karmaTools = require('./project/karma_tools');

gulp.task('buildVersionFile', function(done){
	git.revParse({args:'HEAD'}, function (err, hash) {
		if(err) {
			console.log('Error during getting revision from git: ' + err);
			done(null);
		} else {
			fs.writeFile('VERSION.txt', hash, 'utf8', function (err) {
				done(null);
			});
		}
	});
});

/** This task collect all files which tends to be karma configuration and build array with filenames.
 * This is required for __sync__ processing of each file. In case of async processing (with .pipe() for ex.)
 * multiple Karma instances will be run simultaneously, which will lead to multiple problems, because Karma not
 * suites for multiple launches well.
 *
 * Files collected with 'gulp-filenames' module and can be fetched with 'filenames.get('karma-config-files')'
 * See docs on 'gulp-filenames' for more details.
 */
gulp.task('collectTestConfigurations', function(){		// TODO: maybe done will be better here?
	return gulp.src(SOURCE + "/__test__/**/*.karma.js")
		.pipe(filenames('karma-config-files'));
});


/** Run Karma server sequentially for each configuration provided from 'filenames.get('karma-config-files', 'full')'
 */
gulp.task('test', function (done) {
	run('collectTestConfigurations', 'buildDev', 'buildTests', function(){
		var fnames = filenames.get('karma-config-files', 'full');
		var activeConfigs = karmaTools.getActiveConfigs(fnames);
		karmaTools.runKarma(activeConfigs).then(function(){
			done(null);
		});
	});
});


gulp.task('lint', function(){
	return gulp.src([SOURCE + '/js/**/*.js', '!' + SOURCE + '/js/bower/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format());
});

// SVG Symbols generation
gulp.task('svgSymbols', function () {
	return gulp.src('./images/icons/*.svg')
		.pipe(svgmin())
		.pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon_' }))
		.pipe(gulp.dest(BUILD + '/images'))
});

/** Set few details to make build easier */
gulp.task('normalize', function (done) {
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
	fs.writeFileSync(moreartyPath, JSON.stringify(moreartyJSON, null, 4));

	done(null);
});


/** Building css from scss */
gulp.task('styles', function () {
	return gulp.src(SOURCE + '/styles/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
		.pipe(concat('build.css'))
		.pipe(gulp.dest(BUILD + '/styles')).pipe(sass())
		.pipe(gulp.dest(BUILD + '/styles'))
		.pipe(connect.reload());
});

// AMD script files
gulp.task('amdScripts', function(){
	return buildToAmdScripts(SOURCE + '/js/module/**/*.js', BUILD + '/js/module');
});

/** compiles React's JSX to JS, wraps CommonJS modules to AMD, stores result to BUILD/js/modules */
function buildToAmdScripts(srcPath, destPath){
	return gulp.src(srcPath)					// picking everything from path
		.pipe(gulpif(VERBOSE, using({})))		// printing all files picked in case of VERBOSE
		.pipe(babel())							// converting JSX to JS and some parts of ES6 to ES5
		.pipe(requireConvert())					// converting CommonJS modules to AMD modules
		.pipe(gulp.dest(destPath))				// saving again
		.pipe(connect.reload());				// reloading connect
}


/** Moving all files from source/js to build/js without doing anything. Directories not affected */
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

gulp.task('amdTestScripts', function(){
	return buildToAmdScripts(SOURCE + '/__test__/**/*.spec.js', BUILD + "/js/__test__");
});

gulp.task('buildTests', function(done){
	run('cleanTests', 'amdTestScripts', done);
});

/** Just deletes BUILD folder */
gulp.task('cleanTests', function (callback) {
	del([BUILD + "/js/__test__"], callback);
});

// Live reload
gulp.task('connect', function(done) {
	connect.server({
		root: './',
		livereload: true
	});
	done(null);
});

gulp.task('cleanAmd', function (callback) {
	del(BUILD + '/js/module', callback);
});

gulp.task('buildDev', function(done){
	run('clean', 'normalize', 'lint', 'styles', 'moveBowerScripts', 'moveCoreScripts', 'amdScripts', 'svgSymbols', done);
});

// Run build
gulp.task('default', function (done) {

	gulp.watch(SOURCE + '/styles/**/*.scss', function(event) {
		console.log('STYLES RELOAD');
		gulp.run('styles');
	});

	gulp.watch(SOURCE + '/js/*.js', function(event) {
		console.log('MAIN SCRIPTS RELOAD');
		run('lint', 'moveCoreScripts');
	});

	gulp.watch([SOURCE + '/js/module/**/*.js', SOURCE + '/js/module/*.js'], function(event) {
		console.log('AMD SCRIPTS RELOAD');
		run('cleanAmd', 'lint', 'amdScripts');
	});

	run('buildDev', 'connect', done);
});

gulp.task('deploy', function (callback) {
    run('clean', 'lint', 'styles', 'normalize', 'moveBowerScripts', 'moveCoreScripts', 'amdScripts', 'svgSymbols', 'buildVersionFile', callback);
});