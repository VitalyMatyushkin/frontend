const	TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		Promise				= require('bluebird');

const TeamSubmitMixin = {
	_submitRival: function(event, rival, rivalIndex) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(self),
				model			= binding.toJS('model');

		//if(model.type === 'inter-schools' && rival.id !== activeSchoolId) {
		//	self._submitInvite(event, rival);
		//}

		return self._submitTeam(event, rival, rivalIndex);
	},
	_submitTeam: function(event, rival, rivalIndex) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				mode	= binding.get(`teamModeView.teamWrapper.${rivalIndex}.teamsSaveMode`);
		let		promise;

		switch (mode) {
			case 'current':
			case 'selectedTeam':
				promise = self._submitOldTeam(event, rival, rivalIndex);
				break;
			case 'temp':
				promise = self._submitNewTeam(event, rival, rivalIndex, true);
				break;
			case 'new':
				promise = self._submitNewTeam(event, rival, rivalIndex, false);
				break;
		}

		return promise;
	},
	_submitOldTeam: function(event, rival, rivalIndex) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				teamId	= self.getDefaultBinding().toJS(`teamModeView.teamWrapper.${rivalIndex}.selectedTeamId`);

		return window.Server.addTeamToschoolEvent.post(
			{
				schoolId:	self.activeSchoolId,
				eventId:	event.id
			},
			{
				teamId: teamId
			}
		).then( _ => {
			let	promises	= [],
				teamData	= {teamId: teamId};

			if (event.type == 'houses') {
				teamData.houseId = rival.id;
			}
			promises.push(new Promise(resolve => resolve(teamData)));

			if (binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamsSaveMode` == 'current')) {
				const	initialPlayers	= binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.prevPlayers`),
						teamId			= binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.selectedTeamId`);

				// we need set userId to each player.
				// it's need for server request
				const updPlayers = self._preparePlayersToCommit(
					binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.players`)
				);

				promises.push( TeamHelper.commitPlayers(initialPlayers, updPlayers, teamId, self.activeSchoolId) );
			}

			return Promise.all(promises);
		});
	},
	/**
	 * Prepare players array for commit.
	 * Add userId to each player
	 * @param players
	 * @returns {*}
	 * @private
	 */
	_preparePlayersToCommit: function(players) {
		return players.map(player => {
			const updPlayer = Object.assign({}, { userId: player.id}, player);

			return updPlayer;
		});
	},
	_submitNewTeam: function(event, rival, rivalIndex, isTemp) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				activeSchoolId	= binding.get('schoolInfo.id');
		let		rivalModel		= {
									name:		binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamName.name`),
									ages:		binding.toJS('model.ages'),
									gender:		binding.toJS('model.gender'),
									sportId:	event.sportId,
									schoolId:	activeSchoolId,
									tempTeam:	isTemp
								};

		if(event.type == 'houses') {
			rivalModel.houseId = rival.id;
		}

		let team;

		// create new team
		return window.Server.teams.post(self.activeSchoolId, rivalModel)
			.then( _team => {
				team = _team;

				//add team to event
				return window.Server.addTeamToschoolEvent.post(
					{
						schoolId:	self.activeSchoolId,
						eventId:	event.id
					},
					{
						teamId: team.id
					}
				);
			})
			.then( _ => {
				// we need set userId to each player.
				// it's need for server request
				const updPlayers = self._preparePlayersToCommit(
					binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.players`)
				);

				const	teamData		= [ new Promise( resolve => resolve({teamId: team.id}) ) ],// this data need on finish of event creation
						playersPromises	= TeamHelper.commitPlayers([], updPlayers, team.id, self.activeSchoolId);

				return Promise.all( playersPromises.concat( teamData ) );
			});
	},
	_submitInvite: function(event, rival) {
		const	self	= this;

		window.Server.invitesByEvent.post({eventId: event.id}, {
			eventId:	event.id,
			inviterId:	self.getDefaultBinding().get('schoolInfo.id'),
			guestId:	rival.id,
			message:	'message'
		});
	}
};

module.exports = TeamSubmitMixin;