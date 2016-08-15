const	TeamHelper			= require('module/ui/managers/helpers/team_helper'),
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
	createTeams: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// for inter school event create team only for first rival
		// because it's inter school event:)
		let rivals;
		if(binding.toJS('model.type') === "inter-schools") {
			rivals = [binding.toJS(`rivals.0`)];
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