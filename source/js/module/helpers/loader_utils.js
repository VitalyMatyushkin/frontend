/**
 * Created by wert on 19.11.15.
 */

const Promise = require('bluebird');

const 	specialModels 	= [
		'app',
		'parents',
		'manager',
		'admin',
		'site',
		'www',
		'stage',
		'playground',
		'password',
		'bigscreen',
		'api_test',
		'invite'
	],
		defaultModel 	= 'school',
		apiVersion 		= 1;

/** Parses domain name to structure */
function parseDomainName(domainName) {
	// http://manager.squard.com → ["manager.squard.com", "manager", undefined|stage, "squard"]
	const external = domainName.match(/([A-z0-9-]+)+(?:.(stage|stage1|stage2|prod|preprod))?.(squadintouch|squard)\.(com|co\.uk)/);
	
	let model;
	if(external[1].substring(0, 10) === 'bigscreen_') {
		model = 'bigscreen';
	} else {
		model = external[1];
	}
	
	return {
		fullName: 		external[0],
		model: 			model,
		isStage: 		external[2] === 'stage' || external[2] === 'stage2',
		rootDomain: 	external[3],
		env: 			external[2]
	}
}

/** Returns api endpoint based on given domain name */
function apiSelector(domainName) {
	const parsedDomain = parseDomainName(domainName);
	let apiDomains;
	switch (true) {
		case parsedDomain.rootDomain === 'squadintouch' && parsedDomain.env === 'stage2':
			apiDomains = {
				main: 	'//api2.stage.squadintouch.com',
				img: 	'//img.stage.squadintouch.com'
			};
			break;
		case parsedDomain.rootDomain === 'squadintouch' && parsedDomain.env === 'stage1':
			apiDomains = {
				main: 	'//api.stage1.squadintouch.com',
				img: 	'//img.stage1.squadintouch.com'
			};
			break;
		case parsedDomain.rootDomain === 'squadintouch':
			apiDomains = {
				main: 	'//api2' + (parsedDomain.env ? '.' + parsedDomain.env : '') + `.squadintouch.com`,
				img: 	'//images' + (parsedDomain.env ? '.' + parsedDomain.env : '') + '.squadintouch.com'
			};
			break;
		case parsedDomain.rootDomain === 'squard':
			apiDomains = {
				// TODO COMMENT THIS LINE BEFORE COMMIT. ONLY FOR LOCAL WORK.
				// main:   `//localhost:3000`,
				main: 	`//api.stage1.squadintouch.com`,
				img: 	'//img.stage1.squadintouch.com'
			};
			break;
		default:
			apiDomains = {
				main: 	`//api.stage.squadintouch.com/v${apiVersion}`,
				img: 	'//img.stage.squadintouch.com'
			};
	}
	
	return apiDomains;
}

/** Chooses module to load based on given domain name */
function startModuleSelector(domainName) {
	const 	parsedDomain 	= parseDomainName(domainName),
			model 			= parsedDomain.model,
			modelToStart 	= specialModels.indexOf(model) !== -1 ? model : defaultModel;
	
	let startModule = 'module/start_as_' + modelToStart;
	
	// TEST SERVER TEMPORARY SOLUTION
	if (startModule === 'module/start_as_stage') {
		startModule = 'module/start_as_www';
	}
	
	return startModule;
}

function isDeveloperEnvironment(domainName){
	const parsedDomain = parseDomainName(domainName);

	return parsedDomain.env === 'stage2' || parsedDomain.env === 'stage1' || parsedDomain.rootDomain === 'squard';
}

function sendGetRequestToHttpUrl(url) {
	
	return new Promise( function(resolve, reject)  {
		
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		
		xhr.onload = function() {
			if (this.status == 200) {
				resolve(this.response);
			} else {
				const error = new Error(this.statusText);
				error.code = this.status;
				error.response = this.response;
				reject(error);
			}
		};
		
		xhr.onerror = function() {
			reject(new Error("Network Error"));
		};
		
		xhr.send();
	});
	
}


const loaderUtils = {
	parseDomainName: 			parseDomainName,
	apiSelector: 				apiSelector,
	startModuleSelector: 		startModuleSelector,
	isDeveloperEnvironment: 	isDeveloperEnvironment,
	sendGetRequestToHttpUrl: 	sendGetRequestToHttpUrl
};

module.exports = loaderUtils;
