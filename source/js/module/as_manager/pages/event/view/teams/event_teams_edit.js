const	InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		AutocompleteTeam 	= require('module/ui/managers/autocompleteTeam'),
		EventHelper			= require('module/helpers/eventHelper'),
		Team 				= require('module/ui/managers/team/defaultTeam'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty');

const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	componentWillMount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.atomically()
			.set('initialPlayers',		Immutable.fromJS(binding.toJS('players')))
			.set('selectedRivalIndex',	Immutable.fromJS(0))
			// TODO need refactoring
			// prepare data for team react component
			// team react component data structure need refactoring
			// so it's dirty trick
			.set('schoolInfo',			Immutable.fromJS(self.getBinding('schoolInfo').toJS()))
			.set('model',				Immutable.fromJS(self.getBinding('event').toJS()))
			.commit();
	},
	_getAutoComplete: function (order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('event').toJS();

		const autocompleteBinding = {
			default:			binding,
			rival:				self.getBinding('event').sub(['participants', order]),
			players:			binding.sub(['players', order]),
			selectedRivalIndex:	binding.sub('selectedRivalIndex')
		};

		return (
			<AutocompleteTeam binding={autocompleteBinding} />
		);
	},
	_getPlayersManager: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const teamBinding = {
				default: binding,
				rivalId: self.getBinding('event').sub(`participants.${order}.id`),
				players: binding.sub(['players', order])
			};

		return (
			<Team binding={teamBinding} />
		);
	},
	_getPlayers: function(order) {
		const self = this;

		return (
			<div>
				{self._getAutoComplete(order)}
				<div className="eEventTeams_managerWrapper">
					{self._getPlayersManager(order)}
				</div>
			</div>
		);
	},
	_getPlayersForLeftSide: function() {
		const self = this;

		const	event			= self.getBinding('event').toJS(),
				eventType		= event.eventType,
				participants	= event.participants,
				activeSchoolId	= self.getActiveSchoolId();

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === activeSchoolId
		) {
			return self._getPlayers(0);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === activeSchoolId
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
				participants	= event.participants,
				activeSchoolId	= self.getActiveSchoolId();

		if(
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId !== activeSchoolId
		) {
			return self._getPlayers(0);
		} else if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId !== activeSchoolId
		) {
			return self._getPlayers(1);
		} else if (
			participants.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return self._getPlayers(1);
		} else if(participants.length === 1) {
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
