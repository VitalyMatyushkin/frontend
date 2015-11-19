/**
 * Created by wert on 19.11.15.
 */

var bowerDir = '../../../source/js/bower/';

requirejs.config({
    baseUrl: '/build/js',
    paths: {
        classnames: bowerDir + 'classnames/index',
        director:   bowerDir + 'director/build/director',
        immutable:  bowerDir + 'immutable/dist/immutable',
        jquery:     bowerDir + 'jquery/dist/jquery',
        morearty:   bowerDir + 'moreartyjs/dist/morearty',
        react:      bowerDir + "react/react-with-addons"
    }
});


requirejs(
    ['jquery', 'react', 'immutable', 'director', '../../source/js/loader/loader_utils', '../../source/js/helpers/storage2'],
    function($, React, Immutable, Director, loaderUtils, storage){

        // setting some global variables for Morearty
        window.React = React;
        window.Immutable = Immutable;

        window.Helpers = storage;
        //window.Router = Director; // Director does this itself. 



        // Legacy. I don't know why we need it right here, but it was in place like that.
        $.ajaxSetup({
            dataType: 'json',
            crossDomain: true
        });

        var myDomain = document.location.hostname;
        var api = loaderUtils.apiSelector(myDomain);
        var startModule = loaderUtils.startModuleSelector(myDomain);
        console.log('API: ' + api);
        console.log('start module: ' + startModule);

        window.apiBase = api;

        // Morearty requires React and Immutable to be global vars, so it loaded as nested module when both are ready
        require(['morearty'], function(Morearty){
            window.Morearty = Morearty;
            console.log("Moreary should be ok here");

            window['require']([startModule], function(startCallback) {
                startCallback();
            })
        });


});