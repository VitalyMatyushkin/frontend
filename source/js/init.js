/**
 * Created by wert on 19.11.15.
 */

const   Promise     = require('bluebird'),
        $           = require('jquery'),
        React       = require('react'),
		ReactDom	= require('react-dom'),
        Immutable   = require('immutable'),
        log         = require('loglevel'),
		loaderUtils	= require('./module/helpers/loader_utils'),
		storage		= require('./module/helpers/storage'),
		loadSVG		= require('./module/helpers/svg_loader'),
        es6PonyFill = require('./module/helpers/ponyfill/es6_best_parts');

/* Preloading styles here as migration for every component is quite slow - will do it step by step */

const 	resetStyle		= require('../styles/reset.scss'),
		veryBasicStyle	= require('../styles/style.scss');

// main styles
const 	bIcon		= require('../styles/main/b_icon.scss'),
		bLink		= require('../styles/main/b_link.scss'),
		bMainLayout	= require('../styles/main/b_main_layout.scss'),
		bPageIn		= require('../styles/main/b_page_in.scss'),
		bPanel		= require('../styles/main/b_panel.scss'),
		bRoles		= require('../styles/main/b_roles.scss'),
		bSiteWrap 	= require('../styles/main/b_site_wrap.scss'),
		bSubMenu	= require('../styles/main/b_sub_menu.scss'),
		bTopLogo	= require('../styles/main/b_top_logo.scss'),
		bTopMenu	= require('../styles/main/b_top_menu.scss'),
		bTopPanel	= require('../styles/main/b_top_panel.scss');



const 	asAdmin 		= require('./module/start_as_admin'),
		asManager		= require('./module/start_as_manager'),
		asWWW			= require('./module/start_as_www'),
		asLogin			= require('./module/start_as_login'),
		asParents		= require('./module/start_as_parents'),
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

const   myDomain      = document.location.hostname,
		api           = loaderUtils.apiSelector(myDomain),
		startModule   = loaderUtils.startModuleSelector(myDomain);


log.enableAll();    // let it be here a bit...
log.info(`API: ${JSON.stringify(api, null, 2)}`);
log.info(`start module: ${startModule}` );

window.apiBase  = api.main;
window.apiImg   = api.img;

window.logLevel = log; //Make this global for usage


switch(startModule) {
	case 'module/start_as_admin':		asAdmin();		break;
	case 'module/start_as_manager':		asManager();	break;
	case 'module/start_as_parents':		asParents();	break;
	case 'module/start_as_www':			asWWW();		break;
	case 'module/start_as_login':		asLogin();		break;
	case 'module/start_as_password':	asPassword();	break;
	case 'module/start_as_school':		asSchool();		break;
	case 'module/start_as_playground':	asPlayGround();	break;
	case 'module/start_as_bigscreen':	asBigScreen();	break;
	default: asLogin();
}