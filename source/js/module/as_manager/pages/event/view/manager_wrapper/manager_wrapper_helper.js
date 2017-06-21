const	EventHelper	= require('./../../../../../helpers/eventHelper'),
		TeamHelper	= require('./../../../../../ui/managers/helpers/team_helper');

const ManagerWrapperHelper = {
	getRivals: function(activeSchoolId, event, isFakeTeams) {
		const rivals = [
			this.getRivalByOrder(activeSchoolId, event, 0, isFakeTeams),
			this.getRivalByOrder(activeSchoolId, event, 1, isFakeTeams)
		];

		return rivals;
	},
	getRivalByOrder: function(activeSchoolId, event, order, isFakeTeams) {
		let rival;

		// Add school or house
		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				let school;
				switch (order) {
					case 0:
						school = event.inviterSchool.id === activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
						break;
					case 1:
						school = event.inviterSchool.id !== activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
						break;
				}
				rival = {
					id:			school.id,
					name:		school.name
				};
				break;
			case EventHelper.isHousesEvent(event):
				rival = {
					id:			event.housesData[order].id,
					name:		event.housesData[order].name
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
		rival.players = this.getPlayersByOrder(activeSchoolId, event, order);

		// Add team
		if(TeamHelper.isTeamSport(event)) {
			if(isFakeTeams) {
				rival.team = this.getFakeTeamByOrder(activeSchoolId, event, order);
			} else {
				rival.team = this.getTeamByOrder(activeSchoolId, event, order);
			}
		}

		return rival;
	},
	getPlayersByOrder: function(activeSchoolId, event, order) {
		let result;

		if(event) {
			switch (true) {
				case TeamHelper.isNonTeamSport(event):
					result = this.getNonTeamPlayersByOrder(activeSchoolId, event, order);
					break;
				case TeamHelper.isTeamSport(event):
					result = this.getTeamPlayersByOrder(activeSchoolId, event, order);
					break;
			}
		}

		return result;
	},
	getNonTeamPlayersByOrder: function(activeSchoolId, event, order) {
		const eventType	= EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];

		let players;

		switch(eventType) {
			case 'inter-schools':
				switch (order) {
					case 0:
						players = event.individualsData.filter(p => p.schoolId === activeSchoolId);
						break;
					case 1:
						players = [];
						break;
				};
				break;
			case 'houses':
				players = event.individualsData.filter(p => p.houseId === event.housesData[order].id);
				break;
			case 'internal':
				players = this.getNonTeamPlayersForInternalEvent(activeSchoolId, event, order);
				break;
		}

		return players;
	},
	getNonTeamPlayersForInternalEvent: function(activeSchoolId, event, order) {
		let players;

		switch (true) {
			case TeamHelper.isIndividualSport(event):
				switch (order) {
					case 0:
						players = event.individualsData;
						break;
					case 1:
						players = [];
						break;
				};
				break;
			case TeamHelper.isOneOnOneSport(event):
				switch (event.individualsData.length) {
					case 0:
						players = [];
						break;
					case 1:
						switch (order) {
							case 0:
								players = [event.individualsData[0]];
								break;
							case 1:
								players = [];
								break;
						}
						break;
					case 2:
						players = [event.individualsData[order]];
						break;
				}
				break;
		}

		return players;
	},
	getTeamPlayersByOrder: function(activeSchoolId, event, order) {
		const teams = event.teamsData;

		if(EventHelper.isInterSchoolsEvent(event)) {
			if(order === 0) {
				const t = teams.find(t => t.schoolId === activeSchoolId);
				return typeof t === 'undefined' ? [] : t.players;
			} else {
				return [];
			}
		} else if(EventHelper.isHousesEvent(event)) {
			const t = teams.find(t => t.houseId === event.housesData[order].id);

			if(typeof t !== 'undefined') {
				return t.players;
			} else {
				return [];
			}
		} else {
			return teams && teams[order] ? teams[order].players : [];
		}
	},
	getTeamByOrder: function(activeSchoolId, event, order) {
		let		team;

		const teams = event.teamsData;

		switch (true) {
			case TeamHelper.isTeamSport(event):
				if(EventHelper.isInterSchoolsEvent(event)) {
					if(order === 0) {
						const t = teams.find(t => t.schoolId === activeSchoolId);
						team = t;
					} else {
						team = undefined;
					}
				} else if(EventHelper.isHousesEvent(event)) {
					team = teams.find(t => t.houseId === event.housesData[order].id);
				} else {
					team = teams ? teams[order] : undefined;
				}
				break;
		}

		return team;
	},
	/**
	 * Return fake team by order.
	 * It need for copy event.
	 * Return object with one field - name.
	 * @param activeSchoolId
	 * @param event
	 * @param order
	 * @returns {{name: *}}
	 */
	getFakeTeamByOrder: function(activeSchoolId, event, order) {
		let team;

		const teams = event.teamsData;

		switch (true) {
			case TeamHelper.isTeamSport(event):
				if(EventHelper.isInterSchoolsEvent(event)) {
					if(order === 0) {
						const t = teams.find(t => t.schoolId === activeSchoolId);
						team = t;
					} else {
						team = undefined;
					}
				} else if(EventHelper.isHousesEvent(event)) {
					team = teams.find(t => t.houseId === event.housesData[order].id);
				} else {
					team = teams ? teams[order] : undefined;
				}
				break;
		}

		if(typeof team !== 'undefined') {
			team = {name: team.name};
		}

		return team;
	}
};

module.exports = ManagerWrapperHelper;