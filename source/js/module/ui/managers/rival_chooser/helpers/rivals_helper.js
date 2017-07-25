const	InterSchoolsRivalModel	= require('module/ui/managers/rival_chooser/models/inter_schools_rival_model'),
		InternalRivalModel		= require('module/ui/managers/rival_chooser/models/internal_rival_model');

const RivalHelper = {
	getDefaultRivalsForInterSchoolsEvent: function(activeSchool) {
		const rival = new InterSchoolsRivalModel(activeSchool);

		return [rival];
	},
	getDefaultRivalsForInternalSchoolsEvent: function() {
		return [new InternalRivalModel(), new InternalRivalModel()];
	}
};

module.exports = RivalHelper;