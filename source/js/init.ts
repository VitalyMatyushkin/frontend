/**
 * Created by wert on 19.11.15.
 */

import * as BPromise from 'bluebird';
import * as $ from 'jquery';
import * as log from 'loglevel';
import * as loaderUtils from './module/helpers/loader_utils';
import * as storage from './module/helpers/storage';
import * as loadSVG from './module/helpers/svg_loader';
import * as es6PonyFill from './module/helpers/ponyfill/es6_best_parts';
import * as timezone from 'moment-timezone';
import './style_loader';

import {asAdmin} from './module/start_as_admin';
import {asApp} from './module/start_as_app';
import * as asWWW from './module/start_as_www';
import * as asPassword from './module/start_as_password';
import * as asSchool from './module/start_as_school';
import * as asPlayGround from './module/start_as_playground';
import * as asBigScreen from './module/start_as_bigscreen';
import * as asInvite from './module/start_as_invite';
import {asBlog} from "module/start_as_blog";
import * as testApi from './module/start_as_api_test';
import {ServiceList} from "module/core/service_list/service_list";
import {AdminServiceList} from "module/core/service_list/admin_service_list";

declare global {
	interface Window {
		Server: ServiceList | AdminServiceList;
		Helpers: any
		simpleAlert: any;
		confirmAlert: any;
		sliderAlert: any;
		apiBase: string;
		apiImg: string;
		logLevel: any;
		timezone: any;
	}
}


// adding some undoubtedly required features form ES6
es6PonyFill();

BPromise.config({
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

window.apiBase = api.main;
window.apiImg = api.img;

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
	case 'module/start_as_api_test':	testApi();		break;
	case 'module/start_as_www':			asWWW();		break;
	case 'module/start_as_password':	asPassword();	break;
	case 'module/start_as_school':		asSchool();		break;
	case 'module/start_as_playground':	asPlayGround();	break;
	case 'module/start_as_bigscreen':	asBigScreen();	break;
	case 'module/start_as_invite':		asInvite();		break;
	case 'module/start_as_blog': 		asBlog();		break;
	default: asApp();
}