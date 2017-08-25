const	InterSchoolsRivalModel	= require('module/ui/managers/rival_chooser/models/inter_schools_rival_model'),
		InternalRivalModel		= require('module/ui/managers/rival_chooser/models/internal_rival_model'),
		SportConsts				= require('module/helpers/consts/sport');

const RivalHelper = {
	getDefaultRivalsForInterSchoolsEvent: function(activeSchool) {
		const rival = new InterSchoolsRivalModel(activeSchool);

		return [rival];
	},
	getDefaultRivalsForInternalSchoolsEvent: function(activeSchool, sport) {
		switch (sport.players) {
			case (SportConsts.SPORT_PLAYERS.INDIVIDUAL): {
				return [ new InternalRivalModel(activeSchool) ];
			}
			default: {
				return [ new InternalRivalModel(activeSchool), new InternalRivalModel(activeSchool) ];
			}
		}

	}
};

module.exports = RivalHelper;