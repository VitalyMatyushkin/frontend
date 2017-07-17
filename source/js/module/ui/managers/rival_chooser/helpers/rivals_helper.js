const InterSchoolsRivalModel = require('module/ui/managers/rival_chooser/models/inter_schools_rival_model');

const RivalHelper = {
	getDefaultRivalsForInterSchoolsEvent: function(activeSchool) {
		const rival = new InterSchoolsRivalModel(activeSchool);

		return [rival];
	}
};

module.exports = RivalHelper;