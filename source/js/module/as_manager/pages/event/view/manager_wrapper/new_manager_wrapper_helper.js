const	EventHelper	= require('./../../../../../helpers/eventHelper'),
		TeamHelper	= require('./../../../../../ui/managers/helpers/team_helper'),
		propz		= require('propz');

const NewManagerWrapperHelper = {
	getRivals: function(event, rivals) {
		return rivals.map(r => this.getRivalByOrder(event, r));
	},
	getRivalByOrder: function(event, _rival) {
		let rival;

		// Add school or house
		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				rival = {
					id:			_rival.school.id,
					name:		_rival.school.name
				};
				break;
			case EventHelper.isHousesEvent(event):
				rival = {
					id:			_rival.house.id,
					name:		_rival.name
				};
				break;
			case EventHelper.isInternalEvent(event):
				rival = {
					id:			'',
					name:		''
				};
				break;
		}

		// Add team players
		rival.players = this.getPlayers(event, _rival);

		// Add team
		if(TeamHelper.isTeamSport(event)) {
			// TODO it's fake
			const isFakeTeams = false;
			if(isFakeTeams) {
				//rival.team = this.getFakeTeamByOrder(activeSchoolId, event, order);
			} else {
				rival.team = this.getTeam(_rival);
			}
		}

		return rival;
	},
	getPlayers: function(event, _rival) {
		let result;

		if(event) {
			switch (true) {
				case TeamHelper.isNonTeamSport(event):
					result = this.getNonTeamPlayersByOrder(_rival);
					break;
				case TeamHelper.isTeamSport(event):
					result = this.getTeamPlayers(_rival);
					break;
			}
		}

		return result;
	},
	getNonTeamPlayersByOrder: function(_rival) {
		const players = propz.get(_rival, ['players']);

		return typeof players !== 'undefined' ? players : [];
	},
	getTeamPlayers: function(_rival) {
		const players = propz.get(_rival, ['team', 'players']);

		return typeof players !== 'undefined' ? players : [];
	},
	getTeam: function(_rival) {
		return propz.get(_rival, ['team']);
	}
};

module.exports = NewManagerWrapperHelper;