var DataPrototype = {
	data: {},
	/**
	 * Getting initial state of data
	 * @returns {*}
	 */
	getDefaultState: function() {
		var self = this;

		return self.data;
	},
	/**
	 * Binding to morearty context
	 * @param bindObject
	 */
	setBinding: function(bindObject) {
		var self = this;

		self.bindObject = bindObject;
		self.initBind && self.initBind();
	},
	/**
	 * Define this method in data class
	 */
	initBind: function() {

	}
};


module.exports = DataPrototype;