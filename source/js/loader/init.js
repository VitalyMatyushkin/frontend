/**
 * Created by wert on 19.11.15.
 */

var bowerDir = '../../../source/js/bower/';

requirejs.config({
    paths: {
        classnames: bowerDir + 'classnames/index',
        director:   bowerDir + 'director/lib/director',
        immutable:  bowerDir + 'immutable/dist/immutable',
        jquery:     bowerDir + 'jquery/dist/jquery',
        morearty:   bowerDir + 'moreartyjs/dist/morearty.js',
        react:      bowerDir + "react/react-with-addons.js"
    }
});


requirejs(['jquery', './loader_utils'], function($, loaderUtils){

    $.ajaxSetup({               // Legacy
        dataType: 'json',
        crossDomain: true
    });

    var myDomain = document.location.hostname;
    var parsedDomain = loaderUtils.parseDomainName(myDomain);
    var api = loaderUtils.apiSelector(myDomain);
    var startModule = loaderUtils.startModuleSelector(myDomain);
    console.log('Yep! ' + JSON.stringify(parsedDomain));
    console.log('API: ' + api);
    console.log('start module ' + startModule);

});