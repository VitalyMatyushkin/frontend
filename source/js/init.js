/**
 * Created by wert on 19.11.15.
 */

// @flow

const	Promise		= require('bluebird'),
		$			= require('jquery'),
		log			= require('loglevel'),
		loaderUtils	= require('./module/helpers/loader_utils'),
		storage		= require('./module/helpers/storage'),
		loadSVG		= require('./module/helpers/svg_loader'),
		es6PonyFill = require('./module/helpers/ponyfill/es6_best_parts'),
		styleLoader	= require('./style_loader'),
		timezone	= require('moment-timezone');


const	asAdmin			= require('./module/start_as_admin'),
		asApp			= require('./module/start_as_app'),
		asWWW			= require('./module/start_as_www'),
		asPassword		= require('./module/start_as_password'),
		asSchool		= require('./module/start_as_school'),
		asPlayGround	= require('./module/start_as_playground'),
		asBigScreen		= require('./module/start_as_bigscreen');

// adding some undoubtedly required features form ES6
es6PonyFill();

Promise.config({
	cancellation: true
});

loadSVG();  // will add some svg resources to page

window.Helpers = storage;

const	myDomain	= document.location.hostname,
		api			= loaderUtils.apiSelector(myDomain),
		startModule	= loaderUtils.startModuleSelector(myDomain);


log.enableAll();    // let it be here a bit...
log.info(`API: ${JSON.stringify(api, null, 2)}`);
log.info(`start module: ${startModule}` );

window.apiBase	= api.main;
window.apiImg	= api.img;

//Check availability some server resource
const URL_FOR_CHECK = api.main + "/public/schools?filter=%7B%22limit%22%3A1%7D&{}";

loaderUtils.sendGetRequestToHttpUrl(URL_FOR_CHECK)
.then(
	response => console.log(`Fulfilled: ${URL_FOR_CHECK}`),
	error => console.log(`Rejected: ${URL_FOR_CHECK} \nResponse: ${error.response} \nStatus: ${error.code}`)
);

window.logLevel	= log; //Make this global for usage

window.timezone = timezone.tz.guess() ? timezone.tz.guess() : 'Europe/London';
console.log('Guessed timezone is: ' + window.timezone);

switch(startModule) {
	case 'module/start_as_admin':		asAdmin();		break;
	case 'module/start_as_app':			asApp();		break;
	case 'module/start_as_www':			asWWW();		break;
	case 'module/start_as_password':	asPassword();	break;
	case 'module/start_as_school':		asSchool();		break;
	case 'module/start_as_playground':	asPlayGround();	break;
	case 'module/start_as_bigscreen':	asBigScreen();	break;
	default: asApp();
}
