const RandomHelper = {
	getRandomString: function() {
		// just current date in timestamp view
		return String(+ new Date()) + String(this.getRandomInt(10, 100));
	},
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
};

module.exports = RandomHelper;


