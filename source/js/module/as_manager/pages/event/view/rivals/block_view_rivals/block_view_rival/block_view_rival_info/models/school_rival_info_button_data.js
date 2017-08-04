const RandomHelper = require('module/helpers/random_helper');

class SchoolRivalInfoButtonData {
	constructor(type, isShow, handler) {
		this.id			= RandomHelper.getRandomString();
		this.type		= type;
		this.isShow		= isShow;
		this.handler	= handler;
	}
}

module.exports = SchoolRivalInfoButtonData;