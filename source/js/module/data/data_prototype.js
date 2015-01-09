var DataPrototype = {
	data: {},
	/**
	 * Получаение начального состояния данных
	 * @returns {*}
	 */
	getDefaultState: function() {
		var self = this;

		return self.data;
	},
	/**
	 * Привязка к контексту Morearty
	 * @param bindObject
	 */
	setBinding: function(bindObject) {
		var self = this;

		self.bindObject = bindObject;
		self.initBind && self.initBind();
	},
	/**
	 * Определите данный метод в класс данных
	 */
	initBind: function() {

	}
};


module.exports = DataPrototype;