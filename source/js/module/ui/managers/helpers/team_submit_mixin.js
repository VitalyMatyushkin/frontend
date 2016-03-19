const    TeamHelper     = require('module/ui/managers/helpers/team_helper'),
         MoreartyHelper = require('module/helpers/morearty_helper'),
         Promise = require('bluebird');

const TeamSubmitMixin = {
    _submitRival: function(event, rival, rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding(),
            activeSchoolId = MoreartyHelper.getActiveSchoolId(self),
            model = binding.toJS('model');

        if (model.type === 'inter-schools' && rival.id !== activeSchoolId) {
            self._submitInvite(event, rival);
        }

		return self._submitTeamCreationMode(event, rival, rivalIndex);
    },
    _submitTempCreationMode: function(event, rival, rivalIndex) {
        const self = this;

        return self._submitNewTeam(event, rival, rivalIndex, true);
    },
    _submitTeamCreationMode: function(event, rival, rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding(),
            mode = binding.get(`teamModeView.teamWrapper.${rivalIndex}.teamsSaveMode`);

        let promise;
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
        const self = this,
            binding = self.getDefaultBinding(),
            teamId = self.getDefaultBinding().toJS(`teamModeView.teamWrapper.${rivalIndex}.selectedTeamId`);

        return window.Server.relParticipants.put(
            {
                eventId: event.id,
                teamId: teamId
            },
            {
                eventId: event.id,
                teamId: teamId
            }
        ).then((team) => {
            let	promises	= [],
				teamData	= {teamId: team.teamId};

			if (event.type == 'houses') {
				teamData.houseId = rival.id;
			}
			promises.push(new Promise(resolve => resolve(teamData)));

            if (binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamsSaveMode` == 'current')) {
                const initialPlayers = binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.prevPlayers`),
                    players = binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.players`),
                    teamId = binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.selectedTeamId`);

				promises.push(TeamHelper.commitPlayers(initialPlayers, players, teamId));
            }

            return Promise.all(promises);
        });
    },
    _submitNewTeam: function(event, rival, rivalIndex, isTemp) {
        const self = this,
            binding = self.getDefaultBinding(),
            activeSchoolId = binding.get('schoolInfo.id'),
            players = binding.toJS('players');

        let rivalModel = {
            sportId:  event.sportId,
            schoolId: activeSchoolId,
            tempTeam: isTemp
        };


        if(binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamsSaveMode`) == 'new') {
            //if we create new team base on old team - we should get new name
            rivalModel.name = binding.get(`teamModeView.teamWrapper.${rivalIndex}.newTeamName`);
        } else if(event.type == 'internal') {
            rivalModel.name = rival.name;
        }

        if(event.type == 'houses') {
            rivalModel.houseId = rival.id;
        }

        rivalModel.ages = binding.toJS('model.ages');
        rivalModel.gender = binding.toJS('model.gender');

        return window.Server.participants
            .post(event.id, rivalModel)
            .then((team) => {
                let	promises	= [new Promise(resolve => resolve({teamId: team.id}))];

				promises.push(self._submitPlayers(team, rivalIndex));

				return Promise.all(promises);
            });
    },
    _submitPlayers: function(team, rivalIndex) {
        const self = this,
            binding = self.getDefaultBinding();

        let	players			= binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.players`);
        let	playerPromises	= [];

        players.forEach(function (player) {
            playerPromises.push(self._submitPlayer(team, player));
        });

        return Promise.all(playerPromises);
    },
    _submitPlayer: function(team, player) {
        return window.Server.playersRelation.put(
            {
                teamId:    team.id,
                studentId: player.id
            },
            {
                position:  player.position,
                sub:       player.sub ? player.sub : false
            }
        );
    },
    _submitInvite: function(event, rival) {
        const self = this;

        window.Server.invitesByEvent.post({eventId: event.id}, {
            eventId:   event.id,
            inviterId: self.getDefaultBinding().get('schoolInfo.id'),
            guestId:   rival.id,
            message:   'message'
        });
    }
};

module.exports = TeamSubmitMixin;