const ForceReloadHelper = {
	addForceReloadParameter: function(hash) {
		// hash doesn't have any params
		if(hash.indexOf('?') === -1) {
			return hash + '?' + this.getRandomParameter();
		} else {
			// hash doesn't have force reload parameter
			if(hash.indexOf('v=') === -1) {
				return hash + '&' + this.getRandomParameter();
			} else {
				return hash.replace(/(v=[0-9]{5})/, this.getRandomParameter());
			}
		}
	},
	getRandomParameter: function() {
		return `v=${this.getRandomString()}`;
	},
	getRandomString: function() {
		// just current date in timestamp view
		return String(+ new Date()).substr(-5);
	}
};

module.exports = ForceReloadHelper;