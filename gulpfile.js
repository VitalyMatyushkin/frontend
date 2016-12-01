var SOURCE 			= './source',
	BUILD 			= './build',
	VERBOSE 		= false,						// set to true if extensive console output during build required
	gulp 			= require('gulp'),					// gulp itself
	gulpif 			= require('gulp-if'),			// allows to write conditional pipes
	run 			= require('run-sequence'),			// runs gulp tasks in  _synchronous_ sequence. One by one.
	connect 		= require('gulp-connect'),
	svgstore 		= require('gulp-svgstore'),
	svgmin 			= require('gulp-svgmin'),
	del 			= require('del'),					// plugin to delete files/folders
	using 			= require('gulp-using'),			// gulp.src('*.js').pipe(using({})) will show all files found by '*.js'
	filenames 		= require('gulp-filenames'),
	git 			= require('gulp-git'),
	fs 				= require('fs'),
	webpack			= require('webpack-stream');

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



// SVG Symbols generation
gulp.task('svgSymbols', function () {
	return gulp.src('./images/icons/*.svg')
		.pipe(svgmin())
		.pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon_' }))
		.pipe(gulp.dest(BUILD + '/images'))
});

/** let it be here at least for a while. A bit later it can be removed */
gulp.task('webpack', function() {
	return gulp.src([SOURCE + '/*.js', SOURCE + '/**/*.js'])
		.pipe(webpack( require('./webpack.config')))
		.pipe(gulp.dest('dist/'));
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


gulp.task('cleanAmd', function (callback) {
	del(BUILD + '/js/module', callback);
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
    run('clean', 'svgSymbols', 'buildVersionFile', 'webpack', callback);
});