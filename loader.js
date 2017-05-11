var Loader = {
	SITE_WRAPPER_CLASS_NAME:	'bSiteWrap',
	LOADER_CLASS_NAME:			'bPageLoaderWrapper',

	isScriptFound:				false,
	intervalId:					undefined,
	init: function() {
		var self = this;

		self.addLoaderToDOM();
		document.addEventListener("DOMContentLoaded", self.removeLoaderFromDOM.bind(self));
		//self.intervalId = setInterval(self.handleIntervalTick.bind(self), 500);
	},
	handleIntervalTick: function() {
		var self = this;

		var mainScript = self.getMainScript();
		if(typeof mainScript !== 'undefined' && !self.isScriptFound) {
			mainScript.onload = function() {
				self.removeLoaderFromDOM();
			};

			self.isScriptFound = true;
			clearInterval(self.intervalId);
		}
	},
	getMainScript: function() {
		var	mainScript,
			scripts = document.getElementsByTagName('script');

		if(typeof scripts !== 'undefined') {
			for(var i = 0; i < scripts.length; i++) {
				if(scripts[i].src.search('bundle.js') !== -1) {
					mainScript = scripts[i];
					break;
				}
			}
		}

		return mainScript;
	},
	addLoaderToDOM: function() {
		var a = new Date();
		console.log('ADD ' + a + ' s: ' + a.getMilliseconds());

		var self = this;

		var loader = document.createElement("div");
		loader.className = "bPageLoaderWrapper";
		loader.innerHTML = '<div class="bPageLoader">Loading...</div>';

		var siteWrapper = document.getElementsByClassName(self.SITE_WRAPPER_CLASS_NAME)[0];
		document.body.insertBefore(loader, siteWrapper);
	},
	removeLoaderFromDOM: function() {
		var a = new Date();
		console.log('REMOVE ' + a + ' s: ' + a.getMilliseconds());

		var self = this;

		var loaderWrapper = document.getElementsByClassName(self.LOADER_CLASS_NAME)[0];

		loaderWrapper.outerHTML = "";
		delete loaderWrapper;
	}
};

Loader.init();