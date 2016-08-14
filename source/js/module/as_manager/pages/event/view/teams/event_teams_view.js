const	If					= require('module/ui/if/if'),
		SVG					= require('module/ui/svg'),
		InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper			= require('module/helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty');

const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPointsByStudent: function (userId) {
		const self = this;

		const event = self.getBinding('event').toJS();

		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);
		
		return userScoreDataIndex === -1 ? 0 : event.results.individualScore[userScoreDataIndex].score; 
	},
	handleClickPointSign: function(operation, userId, permissionId, teamId) {
		const self = this;

		const event = self.getBinding('event').toJS();

		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		switch (operation) {
			case "plus":
				if(userScoreDataIndex === -1) {
					event.results.individualScore.push({
						userId:			userId,
						teamId:			teamId,
						permissionId:	permissionId,
						score:	1
					})
				} else {
					event.results.individualScore[userScoreDataIndex].score += 1;
				}
				break;
			case "minus":
				if(userScoreDataIndex === -1) {
					event.results.individualScore.push({
						userId:			userId,
						permissionId:	permissionId,
						teamId:			teamId,
						score:	0
					})
				} else {
					event.results.individualScore[userScoreDataIndex].score > 0 ?
						event.results.individualScore[userScoreDataIndex].score -= 1 :
						event.results.individualScore[userScoreDataIndex].score = 0;
				}
				break;
		};

		self.getBinding('event').set(Immutable.fromJS(event));
	},
	renderPlayersForLeftSide: function() {
		const self = this;

		const	event			= self.getBinding('event').toJS(),
				eventType		= event.eventType,
				teamsData		= event.teamsData,
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId === activeSchoolId
		) {
			return self.renderTeamPlayersByOrder(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId === activeSchoolId
		) {
			return self.renderTeamPlayersByOrder(1);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return self.renderTeamPlayersByOrder(0);
		}
	},
	renderPlayersForRightSide: function() {
		const self = this;

		const	event			= self.getBinding('event').toJS(),
				eventType		= event.eventType,
				teamsData		= event.teamsData,
				activeSchoolId	= self.getActiveSchoolId();

		if(
			teamsData.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId !== activeSchoolId
		) {
			return self.renderTeamPlayersByOrder(0);
		} else if (
			teamsData.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId !== activeSchoolId
		) {
			return self.renderTeamPlayersByOrder(1);
		} else if (
			teamsData.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self.renderTeamPlayersByOrder(1);
		} else if(teamsData.length === 1) {
			return (
				<div className="bEventTeams_team">
					<div className="eEventTeams_awaiting">
						Awaiting opponent...
					</div>
				</div>
			);
		}
	},
	renderPlayers: function(players, eventStatus, isOwner) {
		const self = this;

		return players.map((player, playerIndex) => {
			const	isMale	= player.gender === 'male',
					points	= self.getPointsByStudent(player.id);

			const mode = self.getBinding('mode').toJS();

			return (
				<div key={playerIndex} className="_bPlayer _mMini">
					<If condition={mode !== 'closing' && isOwner}>
						<span className="ePlayer_gender">
							{isMale ? <SVG icon="icon_man" /> : <SVG icon="icon_woman" />}
						</span>
					</If>
					<span className="ePlayer_name">
						<span>{player.firstName} </span>
						<span>{player.lastName}</span>
					</span>
					<If condition={EventHelper.isShowScoreButtons(eventStatus, mode, isOwner)}>
						<span className="ePlayer_minus" onClick={self.handleClickPointSign.bind(self, 'minus', player.id, player.permissionId, player.teamId)}>
							<SVG icon="icon_minus" />
						</span>
					</If>
					<If condition={eventStatus === "FINISHED" || mode === 'closing'}>
						<span className="ePlayer_score">{points}</span>
					</If>
					<If condition={EventHelper.isShowScoreButtons(eventStatus, mode, isOwner)}>
						<span className="ePlayer_plus" onClick={self.handleClickPointSign.bind(self, 'plus', player.id, player.permissionId, player.teamId)}>
							<SVG icon="icon_plus" />
						</span>
					</If>
				</div>
			);
		});
	},
	renderIndividuals: function() {
		const self = this;

		const	event	= self.getBinding('event').toJS(),
				players	= self.getDefaultBinding().toJS('players');

		return self.renderPlayers(players, event.status, true);
	},
	renderTeamPlayersByOrder: function(order) {
		const	self	= this;
		let		players	= null;

		const playersBinding = self.getDefaultBinding().get(['players', order]);

		if(playersBinding) {
			const	event	= self.getBinding('event').toJS(),
					isOwner	= event.eventType === 'inter-schools' ?
								event.teamsData[order].schoolId === self.getActiveSchoolId() :
								true;

			players = self.renderPlayers(
				playersBinding.toJS(),
				event.status,
				isOwner
			);
		}

		return (
			<div className="bEventTeams_team">
				{players}
			</div>
		);
	},
	renderBody: function() {
		const	self	= this;
		let		result	= null;

		if(TeamHelper.isIndividualSport(self.getBinding('event').toJS())) {
			result = (
				<div className="bEventTeams">
					{self.renderIndividuals()}
				</div>
			);
		} else {
			result = (
				<div className="bEventTeams">
					{self.renderPlayersForLeftSide()}
					{self.renderPlayersForRightSide()}
				</div>
			);
		}

		return result;
	},
	render: function() {
		const self = this;

		return self.renderBody();
	}
});

module.exports = EventTeamsView;
