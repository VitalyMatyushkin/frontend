const	If					= require('module/ui/if/if'),
		SVG					= require('module/ui/svg'),
		InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper			= require('module/helpers/eventHelper'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty'),
		Lazy				= require('lazy.js');

const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	removePlayer: function (order, playerId) {
		var self = this,
			binding = self.getDefaultBinding(),
			players = binding.sub(['players', order]);

		players.update(function (data) {
			return data.filter(function (model) {
				return model.get('id') !== playerId;
			});
		});
	},
	getPointsByStudent: function (userId) {
		const self = this;

		const studentPoint = Lazy(self.getBinding('points').toJS()).findWhere({userId: userId});

		return studentPoint ? studentPoint.score : 0;
	},
	addPoint: function (player) {
		const	self			= this,
				pointsBinding	= self.getBinding('points');

		const points = pointsBinding.toJS();

		let point = Lazy(points).findWhere({userId: player.id});

		// if points exist
		if(point) {
			point.score += 1;
			const indexOfPoint = Lazy(points).indexOf(point);
			points[indexOfPoint] = point;
		} else {
			points.push({
				userId:	player.id,
				teamId:	player.teamId,
				score:	1
			});
		}

		pointsBinding.set(Immutable.fromJS(points));
	},
	removePoint: function (order, userId) {
		const	self			= this,
				pointsBinding	= self.getBinding('points');

		pointsBinding.update(function (points) {
			var firstIndex = points.findLastIndex(function (point) {
				return point.get('userId') === userId;
			});

			if (firstIndex !== -1) {
				return points.filter(function (point, index) {
					return index !== firstIndex;
				});
			} else {
				return points;
			}
		});
	},
	_getPlayersList: function (order) {
		const	self = this,
				binding = self.getDefaultBinding();
		let		result;

		const playersBinding = binding.get(['players', order]);

		if(playersBinding) {
			const	players			= playersBinding.toJS(),
					event			= self.getBinding('event').toJS(),
					type			= event.eventType,
					activeSchoolId	= self.getActiveSchoolId(),
					isOwner			= type === 'inter-schools' ? event.teamsData[order].get('schoolId') === activeSchoolId : true;

			result = players.map((player, playerIndex) => {
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
						<If condition={event.status === "NOT_FINISHED" && mode === 'closing'}>
							<span className="ePlayer_minus" onClick={self.removePoint.bind(null, order, player.id)}>
								<SVG icon="icon_minus" />
							</span>
						</If>
						<If condition={event.status === "FINISHED" || mode === 'closing'}>
							<span className="ePlayer_score">{points}</span>
						</If>
						<If condition={mode === 'edit_squad' && isOwner}>
							<span className="ePlayer_remove" onClick={self.removePlayer.bind(null, order, player.id)}>
								<SVG icon="icon_cross" />
							</span>
						</If>
						<If condition={event.status === "NOT_FINISHED" && mode === 'closing' && isOwner}>
							<span className="ePlayer_plus" onClick={self.addPoint.bind(null, player)}>
								<SVG icon="icon_plus" />
							</span>
						</If>
					</div>
				);
			});
		}

		return result;
	},
	_getPlayers: function(order) {
		const self = this;

		return (
			<div className="bEventTeams_team">
				{self._getPlayersList(order)}
			</div>
		);
	},
	_getPlayersForLeftSide: function() {
		const self = this;

		const	event			= self.getBinding('event').toJS(),
				eventType		= event.eventType,
				teamsData	= event.teamsData,
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[0].schoolId === activeSchoolId
		) {
			return self._getPlayers(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId === activeSchoolId
		) {
			return self._getPlayers(1);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return self._getPlayers(0);
		}
	},
	_getPlayersForRightSide: function() {
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
			return self._getPlayers(0);
		} else if (
			teamsData.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			teamsData[1].schoolId !== activeSchoolId
		) {
			return self._getPlayers(1);
		} else if (
			teamsData.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._getPlayers(1);
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
	render: function() {
		const self = this;

		return (
			<div className="bEventTeams">
				{self._getPlayersForLeftSide()}
				{self._getPlayersForRightSide()}
			</div>
		);
	}
});

module.exports = EventTeamsView;
