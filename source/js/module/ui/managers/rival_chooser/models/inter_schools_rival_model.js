const RandomHelper = require('module/helpers/random_helper');

class InterSchoolsRivalModel {
	constructor(school) {
		this.id		= RandomHelper.getRandomString();
		this.school	= school;
	}
}

module.exports = InterSchoolsRivalModel;