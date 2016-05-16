const 	If 					= require('module/ui/if/if'),
		SVG 				= require('module/ui/svg'),
		InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		AutocompleteTeam 	= require('module/ui/managers/autocompleteTeam'),
		EventHelper			= require('module/helpers/eventHelper'),
		Team 				= require('module/ui/managers/team/defaultTeam'),
		React				= require('react'),
		Immutable			= require('immutable');

const EventTeams = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

			binding.set('selectedRivalIndex',  Immutable.fromJS(0));
	},
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
	getPointsByStudent: function (userId, teamId) {
		var self = this,
			binding = self.getDefaultBinding(),
			points =  binding.sub('points'),
			filtered = points.get().filter(function (point) {
				return point.get('userId') === userId && point.get('teamId') === teamId;
			});

		return filtered.count();
	},
	addPoint: function (player) {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('event.type'),
			pointsBinding =  binding.sub('points');

		pointsBinding.update(points => points.push(
			Immutable.fromJS({
				userId:	player.get('id'),
				teamId:	player.get('teamId'),
				score:	1
			})
		));
	},
	removePoint: function (order, userId) {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('event.type'),
			pointsBinding =  binding.sub('points');

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
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('event.type'),
			participant = binding.sub(['participants', order]),
			players = binding.get(['players', order]),
			activeSchoolId = self.getActiveSchoolId(),
			isOwner = type === 'inter-schools' ? participant.get('schoolId') === activeSchoolId : true;

		return players ? players.map(function (player,playerIndex) {
			const	isMale	= player.get('gender') === 'male',
					points	= self.getPointsByStudent(player.get('id'), participant.get('id')) || 0;

			return(
				<div key={playerIndex} className="_bPlayer _mMini">
					<If condition={binding.get('mode') !== 'closing' && isOwner}>
						<span className="ePlayer_gender">
							{isMale ? <SVG icon="icon_man" /> : <SVG icon="icon_woman" />}
						</span>
					</If>
					<span className="ePlayer_name">
						<span>{player.get('firstName')} </span>
						<span>{player.get('lastName')}</span>
					</span>
					{
						binding.get('model.status') === "NOT_FINISHED" && binding.get('mode') === 'closing' ?
						<span className="ePlayer_minus" onClick={self.removePoint.bind(null, order, player.get('id'))}>
							<SVG icon="icon_minus" />
						</span>
						: null
					}
					<If condition={binding.get('model.status') === "FINISHED" || binding.get('mode') === 'closing'}>
						<span className="ePlayer_score">{points}</span>
					</If>
					<If condition={binding.get('mode') === 'edit_squad' && isOwner}>
						<span className="ePlayer_remove" onClick={self.removePlayer.bind(null, order, player.get('id'))}>
							<SVG icon="icon_cross" />
						</span>
					</If>
					<If condition={binding.get('model.status') === "NOT_FINISHED" && binding.get('mode') === 'closing' && isOwner}>
						<span className="ePlayer_plus" onClick={self.addPoint.bind(null, player)}>
							<SVG icon="icon_plus" />
						</span>
					</If>
				</div>
			);
		}).toArray() : null;
	},
	_getAutoComplete: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('event.type'),
			activeSchoolId = self.getActiveSchoolId(),
			isOwner = type === 'inter-schools' ?  binding.get(['participants', order, 'schoolId']) === activeSchoolId : true,
			completeBinding = {
				default:            binding,
				rival:              binding.sub(['participants', order]),
				players:            binding.sub(['players', order]),
				selectedRivalIndex: binding.sub('selectedRivalIndex')
			};

		return isOwner && binding.get('mode') === 'edit_squad' && binding.get('model.status') === "NOT_FINISHED" ?
			<AutocompleteTeam binding={completeBinding} /> : null;
	},
	_getPlayersManager: function(order) {
		const self = this,
			binding = self.getDefaultBinding(),
			teamBinding = {
				default: binding,
				rivalId: binding.sub(['participants', order]).sub('id'),
				players: binding.sub(['players', order])
			};

		return (
			<Team binding={teamBinding} />
		);
	},
	_getPlayers: function(order) {
		const self = this,
			binding = self.getDefaultBinding(),
			eventType = binding.get('model.eventType'),
			participant = binding.sub(['participants', order]),
			activeSchoolId = self.getActiveSchoolId(),
			isOwner = eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] ?
				participant.get('schoolId') === activeSchoolId :
				true;

		return (
			<div>
				<If condition={binding.get('mode') === 'edit_squad' && isOwner}>
					<div>
						{self._getAutoComplete(order)}
						<div className="eEventTeams_managerWrapper">
							{self._getPlayersManager(order)}
						</div>
					</div>
				</If>
				<If condition={binding.get('mode') === 'general' || binding.get('mode') === 'closing'}>
					<div className="bEventTeams_team">
						{self._getPlayersList(order)}
					</div>
				</If>
			</div>
		);
	},
	render: function() {
		const self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bEventTeams">
				{self._getPlayers(0)}
				<If condition={binding.get('participants').count() > 1}>
					{self._getPlayers(1)}
				</If>
				<If condition={binding.get('participants').count() === 1}>
					<div className="bEventTeams_team">
						<div className="eEventTeams_awaiting">
							Awaiting opponent...
						</div>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = EventTeams;
