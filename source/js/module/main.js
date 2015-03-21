window.onload = function() {
	var managerMode = document.location.hostname === 'manager.squard.com',
		startPoint = 'module/' + (managerMode ? 'manager_mode' : 'main_mode');

	window['require']([startPoint], function(startCallback) {
		startCallback();
	});
};

