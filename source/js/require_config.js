requirejs.config({
	baseUrl: '/build/js'
});

window.onload = function() {
	var defaultMode = 'main',
		modes = {
			'manager.squard.com': 'manager',
			'manager.squadintouch.com': 'manager',
			'squard.com': 'main',
			'squadintouch.com': 'main',
			'parents.squard.com': 'parents',
			'parents.squadintouch.com': 'parents'
		},
		startModule = 'module/start_as_';

	startModule += modes[document.location.hostname] || defaultMode;

	window['require']([startModule], function(startCallback) {
		startCallback();
	});
};
