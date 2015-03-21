requirejs.config({
	baseUrl: '/build/js'
});

window.onload = function() {
	var managerMode = document.location.hostname === 'manager.squard.com',
		startPoint = 'module/' + (managerMode ? 'start_as_manager' : 'start_as_user');

	window['require']([startPoint], function(startCallback) {
		startCallback();
	});
};
