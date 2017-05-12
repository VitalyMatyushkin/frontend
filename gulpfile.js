var SOURCE 			= './source',
	BUILD 			= './build',
	VERBOSE 		= false,						// set to true if extensive console output during build required
	gulp 			= require('gulp'),					// gulp itself
	gulpif 			= require('gulp-if'),			// allows to write conditional pipes
	run 			= require('run-sequence'),			// runs gulp tasks in  _synchronous_ sequence. One by one.
	connect 		= require('gulp-connect'),
	svgstore 		= require('gulp-svgstore'),
	svgmin 			= require('gulp-svgmin'),
	cheerio 		= require('gulp-cheerio'),
	del 			= require('del'),					// plugin to delete files/folders
	using 			= require('gulp-using'),			// gulp.src('*.js').pipe(using({})) will show all files found by '*.js'
	filenames 		= require('gulp-filenames'),
	git 			= require('gulp-git'),
	fs 				= require('fs'),
	webpack			= require('webpack-stream');

gulp.task('copyLoader', function() {
		gulp
			.src('loader/*')
			.pipe(gulp.dest('dist/loader'));
	}
);

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
	.pipe(cheerio({
		run: function ($, file) {
			//get file name without extension, example: tennis, cricket, rounders, etc
			var filePath = file.history[0].lastIndexOf('\\'),
				fileNameSvg;
			if (filePath === -1) {
				fileNameSvg = file.history[0].substring(file.history[0].lastIndexOf('/')+1, (file.history[0].length-4)).replace(" ", "_");
			} else {
				fileNameSvg = file.history[0].substring(file.history[0].lastIndexOf('\\')+1, (file.history[0].length-4)).replace(" ", "_");
			}
			// add filename in all svg tags, which contain attr "class" .st0, .st1, .st2
			$('.st0, .st1, st2').each(function(){
				var classSvg = $(this);
				
				classSvg.attr('class', classSvg.attr('class') + '-' + fileNameSvg);
			});
			// add filename in all svg tags <style>, which contain class .st0, .st1, .st2
			$('style').each(function(){
				var style 		= $(this),
					styleText 	= style.text()
						.replace(".st0", ".st0-" + fileNameSvg)
						.replace(".st1", ".st1-" + fileNameSvg)
						.replace(".st2", ".st2-" + fileNameSvg);
				
				style.text(styleText);
			});
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon_' }))
	.pipe(gulp.dest(BUILD + '/images'))
});

// SVG Symbols generation for IE
gulp.task('svgSymbolsIE', function () {
	return gulp.src('./images/icons/*.svg')
	.pipe(svgmin())
	.pipe(cheerio({
		run: function ($, file) {
			//we cut tag <defs> and <clipPath>, because in IE in sprite this tags do not work correctly
			$('defs').remove();
			$('clipPath').remove();
			//get file name without extension, example: tennis, cricket, rounders, etc
			var filePath = file.history[0].lastIndexOf('\\'),
				fileNameSvg;
			if (filePath === -1) {
				fileNameSvg = file.history[0].substring(file.history[0].lastIndexOf('/')+1, (file.history[0].length-4)).replace(" ", "_");
			} else {
				fileNameSvg = file.history[0].substring(file.history[0].lastIndexOf('\\')+1, (file.history[0].length-4)).replace(" ", "_");
			}
			// add filename in all svg tags, which contain attr "class" .st0, .st1, .st2
			$('.st0, .st1, st2').each(function(){
				var classSvg = $(this);
				
				classSvg.attr('class', classSvg.attr('class') + '-' + fileNameSvg);
			});
			// add filename in all svg tags <style>, which contain class .st0, .st1, .st2
			$('style').each(function(){
				var style 		= $(this),
					styleText 	= style.text()
					.replace(".st0", ".st0-" + fileNameSvg)
					.replace(".st1", ".st1-" + fileNameSvg)
					.replace(".st2", ".st2-" + fileNameSvg);
				
				style.text(styleText);
			});
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(svgstore({ fileName: 'iconsIE.svg', prefix: 'icon_' }))
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
    run('clean', 'svgSymbols', 'svgSymbolsIE', 'buildVersionFile', 'copyLoader', 'webpack', callback);
});