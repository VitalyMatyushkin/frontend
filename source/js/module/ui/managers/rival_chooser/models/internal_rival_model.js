const RandomHelper = require('module/helpers/random_helper');

class InternalRivalModel {
	constructor(school) {
		this.id		= RandomHelper.getRandomString();
		this.school	= school;
	}
}

module.exports = InternalRivalModel;