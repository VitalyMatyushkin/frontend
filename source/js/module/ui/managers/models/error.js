const RandomHelper = require('module/helpers/random_helper');

class Error {
	constructor(rivalId, isError, text) {
		this.id			= RandomHelper.getRandomString();
		this.rivalId	= rivalId;
		this.text		= text;
		this.isError	= isError;
	}
}

module.exports = Error;