var Loader = {
	SITE_WRAPPER_CLASS_NAME:	'bSiteWrap',
	LOADER_CLASS_NAME:			'bPageLoaderWrapper',

	isScriptLoaded:				false,
	intervalId:					undefined,
	init: function() {
		var self = this;

		if(!self.isFinishMainScriptLoading()) {
			self.addLoaderToDOM();
			self.intervalId = setInterval(self.handleIntervalTick.bind(self), 500);
		}
	},
	handleIntervalTick: function() {
		var self = this;

		// if script was found, but isScriptLoaded flag is still false.
		if(self.isFinishMainScriptLoading() && !self.isScriptLoaded) {
			self.isScriptLoaded = true;

			self.removeLoaderFromDOM();

			clearInterval(self.intervalId);
		}
	},
	isFinishMainScriptLoading: function() {
		var scripts = document.getElementsByTagName('script');

		if(typeof scripts !== 'undefined') {
			var script;
			for(var i = 0; i < scripts.length; i++) {
				if(scripts[i].src.search('bundle.js') !== -1) {
					script = scripts[i];
					break;
				}
			}

			return typeof script !== 'undefined';
		}
	},
	addLoaderToDOM: function() {
		var a = new Date();
		console.log('ADD ' + a + ' s: ' + a.getMilliseconds());

		var self = this;

		var loader = document.createElement("div");
		loader.innerHTML = '<div class="bPageLoaderWrapper"><svg class="bPageLoader"><use xlink:href="#icon_spin-loader-black"></use></svg></div>';

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