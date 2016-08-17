const	EventHelper			= require('./../../../helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		MoreartyHelper		= require('module/helpers/morearty_helper');

const TeamSubmitMixin = {
	addIndividualPlayersToEvent: function(savedEvent) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const players = binding.toJS(`teamModeView.teamWrapper`).reduce(
			(players, teamWrapper) => players.concat(teamWrapper.___teamManagerBinding.teamStudents),
			[]
		);

		return window.Server.schoolEventIndividualsBatch.post(
			{
				schoolId:	savedEvent.inviterSchoolId,
				eventId:	savedEvent.id
			},
			{
				individuals: players.map(p => {
					return {
						userId:			p.id,
						permissionId:	p.permissionId
					};
				})
			}
		);
	},
	/**
	 * Create teams on step3 of event creation.
	 * @returns {*}
	 */
	createTeams: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// For inter school event create team only for only one rival - active school
		// There are two situations:
		// 1) Create inter-schools event - create team only for inviter school
		// 2) Acceptation event - create team for invited school
		let rivals;
		if(
			EventHelper.isInterSchoolsEvent(binding.toJS('model'))) {
			rivals = [ binding.toJS(`rivals`).find(r => r.id === self.activeSchoolId) ];
		} else {
			rivals = binding.toJS('rivals');
		}

		return rivals.map((rival, i) => {
			const teamWrapper = binding.toJS(`teamModeView.teamWrapper.${i}`);

			const teamBody = {};
			switch (self.getTypeOfNewTeam(teamWrapper)) {
				case "CLONE":
					teamBody.name		= teamWrapper.teamName.name;
					teamBody.players	= teamWrapper.___teamManagerBinding.teamStudents;

					return self.createTeamByPrototype(
						teamWrapper.selectedTeam,
						teamBody
					);
				case "ADHOC":
					const event = binding.toJS('model');

					teamBody.name			= teamWrapper.teamName.name;
					teamBody.ages			= event.ages;
					teamBody.gender			= TeamHelper.convertGenderToServerValue(event.gender);
					teamBody.sportId		= event.sportId;
					teamBody.schoolId		= MoreartyHelper.getActiveSchoolId(self);
					teamBody.players		= TeamHelper.convertPlayersToServerValue(teamWrapper.___teamManagerBinding.teamStudents);
					teamBody.teamType		= "ADHOC";
					event.houseId && (
						teamBody.houseId	= event.houseId
					);

					return self.createAdhocTeam(teamBody);
			}
		});
	},
	addTeamsToEvent: function(event, teams) {
		const self = this;

		return Promise.all(teams.map(t => window.Server.schoolEventTeams.post(
			{
				schoolId:	self.activeSchoolId,
				eventId:	event.id
			}, {
				teamId:		t.id
			}
		)));
	},
	getTypeOfNewTeam: function(teamWrapper) {
		if(teamWrapper.selectedTeam) {
			return "CLONE";
		} else {
			return "ADHOC";
		}
	},
	createTeamByPrototype: function(prototype, teamBody) {
		return window.Server.cloneTeam.post(
			{
				schoolId:	prototype.schoolId,
				teamId:		prototype.id
			}
		)
		.then(team => {
			return window.Server.team.put(
				{
					schoolId:	team.schoolId,
					teamId:		team.id
				}, {
					name:		teamBody.name,
					players:	TeamHelper.convertPlayersToServerValue(teamBody.players)
				}
			)
		});
	},
	createAdhocTeam: function(body) {
		return window.Server.teamsBySchoolId.post(body.schoolId, body);
	}
};

module.exports = TeamSubmitMixin;