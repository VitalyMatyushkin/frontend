var Loader = {
	SITE_WRAPPER_CLASS_NAME:	'bSiteWrap',
	LOADER_CLASS_NAME:			'bPageLoaderWrapper',
	init: function() {
		var self = this;

		self.addLoaderToDOM();
		document.addEventListener("DOMContentLoaded", self.removeLoaderFromDOM.bind(self));
	},
	addLoaderToDOM: function() {
		var self = this;

		var loader = document.createElement("div");
		loader.className = "bPageLoaderWrapper";
		loader.innerHTML = '<div class="bPageMessage"><svg class="bIcon bLoginIcon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon_login"><title></title></use></svg><svg class="bPageLoader"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon_spin-loader-black"><title></title></use></svg></div>';

		var siteWrapper = document.getElementsByClassName(self.SITE_WRAPPER_CLASS_NAME)[0];
		document.body.insertBefore(loader, siteWrapper);
	},
	removeLoaderFromDOM: function() {
		//var self = this;
		//
		//var loaderWrapper = document.getElementsByClassName(self.LOADER_CLASS_NAME)[0];
		//
		//loaderWrapper.outerHTML = "";
		//delete loaderWrapper;
	}
};

Loader.init();


