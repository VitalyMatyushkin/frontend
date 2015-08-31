// This redirect should be provided by served side (squard.com → www.squard.com)
if ((document.location.hostname.match(/\./g) || []).length === 1) {
	document.location = document.location.protocol + '//www.' + document.location.hostname;
}

requirejs.config({
	baseUrl: '/build/js'
});

window.onload = function() {
	var defaultMode = 'school',
		// http://manager.squard.com → ["manager.squard.com", "manager", undefined|stage, "squard"]
		external = document.location.hostname.match(/([A-z0-9-]+)+(?:.(stage))?.(squadintouch|squard)\.com/),
		specialModels = ['parents', 'manager', 'admin', 'site', 'www', 'stage'],
		startModule = 'module/start_as_',
		//apiBase = 'localhost:3000',
		apiBase = 'api.stage.squadintouch.com',
		version = 1;


	if (external[3] === 'squadintouch' && external[2] === undefined) {
		apiBase = 'api.squadintouch.com';
	}

	window.apiBase = '//' + apiBase + '/v' + version;

	startModule += specialModels.indexOf(external[1]) !== -1 ? external[1] : defaultMode;

	// TEST SERVER TEMPORARY SOLUTION
	if (startModule === 'module/start_as_stage') {
		startModule = 'module/start_as_www';
	}

	// ajax global
	$.ajaxSetup({
		dataType: 'json',
		crossDomain: true
	});

    console.log(startModule);

	window['require']([startModule], function(startCallback) {
		startCallback();
	});
};
