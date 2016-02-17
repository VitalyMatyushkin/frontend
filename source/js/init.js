/**
 * Created by wert on 19.11.15.
 */

var bowerDir = 'bower/';

requirejs.config({
    waitSeconds: 15,            // will wait for a bit longer than usual, to be ok on slow connections
    baseUrl: '/build/js',
    paths: {
        classnames: bowerDir + 'classnames/index',
        director:   bowerDir + 'director/build/director',
        immutable:  bowerDir + 'immutable/dist/immutable',
        jquery:     bowerDir + 'jquery/dist/jquery',
        morearty:   bowerDir + 'moreartyjs/dist/morearty',
        react:      bowerDir + "react/react-with-addons",
        reactDom:   bowerDir + 'react/react-dom',
        loglevel:   bowerDir + "loglevel/dist/loglevel.min",
        bluebird:   bowerDir + 'bluebird/js/browser/bluebird',
        lazyjs:     bowerDir + 'lazy.js/lazy'
    },
    shim: {
        /** Making classname acts like AMD library */
        'classnames': {
            init: function(){
                var classNames = this.classNames;   // picking it from global namespace
                this.classNames = undefined;        // removing global link
                return classNames;                  // returning as it AMD module does
            }
        }
    }
});


const b = {
    name: "Alex"
};

const a = Object.assign({}, b, {age: 25});

console.log('a: ' + JSON.stringify(a));

requirejs(
    ['jquery', 'react', 'immutable', 'director', 'loglevel', 'bluebird', 'module/helpers/loader_utils', 'module/helpers/storage', 'module/helpers/svg_loader','reactDom'],
    function($, React, Immutable, Director, log, Promise, loaderUtils, storage, loadSVG,ReactDOM){

        Promise.config({
            cancellation: true
        });

        loadSVG();  // will add some svg resources to page

        // Morearty requires to have React and Immutable in global context, so
        // setting some global variables for Morearty
        window.React = React;
        window.ReactDOM = ReactDOM; //global react-dom package
        window.Immutable = Immutable;

        window.Helpers = storage;
        //window.Router = Director; // Director does this itself. 


        // Legacy. I don't know why we need it right here, but it was in place like that.
        $.ajaxSetup({
            dataType: 'json',
            crossDomain: true
        });

        const myDomain = document.location.hostname;
        const api = loaderUtils.apiSelector(myDomain);
        const startModule = loaderUtils.startModuleSelector(myDomain);

        log.enableAll();    // let it be here a bit...
        log.info(`API: ${api}`);
        log.info(`start module: ${startModule}` );

        window.apiBase = api;

        window.logLevel = log; //Make this global for usage

        // Morearty requires React and Immutable to be global vars, so it loaded as nested module when both are ready
        require(['morearty'], function(Morearty){
            window.Morearty = Morearty;

            window['require']([startModule], function(startCallback) {
                startCallback();
            })
        });


});