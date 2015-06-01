requirejs.config({
	baseUrl: '/build/js'
});

window.onload = function() {
	var defaultMode = 'main',
		// http://manager.squard.com -> ["manager.squard.com", "manager", undefined|stage, "squard"]
		external = document.location.hostname.match(/([A-z0-9-]+)+(?:.(stage))?.(squadintouch|squard)\.com/),
		specialModels = ['parents', 'manager'],
		startModule = 'module/start_as_',
		apiBase = 'api.stage.squadintouch.com',
		version = 1;


	if (external[3] === 'squadintouch' && external[2] === undefined) {
		window.apiBase = 'api.squadintouch.com';
	}

	window.apiBase = '//' + apiBase + '/v' + version;

	startModule += specialModels.indexOf(external[1]) !== -1 ? external[1] : defaultMode;

	window['require']([startModule], function(startCallback) {
		startCallback();
	});
};
