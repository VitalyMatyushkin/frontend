const RandomHelper = require('module/helpers/random_helper');

class InternalRivalModel {
	constructor() {
		this.id = RandomHelper.getRandomString();
	}
}

module.exports = InternalRivalModel;