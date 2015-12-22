/**
 * Created by wert on 21.12.15.
 */

var allTestFiles = [];
var bowerFiles = [];
var moduleFiles = [];
var testFiles = [];
var uncategorizedFiles = [];

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
    if(file.startsWith('/base/build/js/__test__')) {
        testFiles.push(file);
    } else if(file.startsWith('/base/build/js/module')) {
        moduleFiles.push(file);
    } else if(file.startsWith('/base/build/js/bower')) {
        bowerFiles.push(file);
    } else {
        uncategorizedFiles.push(file);
    }
});


require.config({
    baseUrl: '/base/build/js',
    paths: {
        jquery:     'bower/jquery/dist/jquery',
        react:      "bower/react/react-with-addons",
        classnames: 'bower/classnames/index',
        director:   'bower/director/build/director',
        immutable:  'bower/immutable/dist/immutable',
        jquery:     'bower/jquery/dist/jquery',
        morearty:   'bower/moreartyjs/dist/morearty',
        react:      "bower/react/react-with-addons",
        reactDom:   'bower/react/react-dom',
        loglevel:   "bower/loglevel/dist/loglevel.min",
        bluebird:   'bower/bluebird/js/browser/bluebird'
    },
    //deps: testFiles,
    //callback: window.__karma__.start
});

requirejs(['bluebird'], function(BluePromise){
    BluePromise.config({
        cancellation: true
    });

    require(testFiles, function(){
        window.__karma__.start();
    });
});