const	InvitesMixin		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventTeamsView		= require('./event_teams_view'),
		EventTeamsEdit		= require('./event_teams_edit'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Lazy				= require('lazy.js'),
		Morearty			= require('morearty');

const EventTeams = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	propTypes: {
		reload: 			React.PropTypes.func
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			viewPlayers: {
				players: []
			},
			editPlayers: {
				players: []
			},
			isSync: false
		});
	},
	componentWillMount: function() {
		const self = this;

		self._loadPlayers();

		self._addListeners();
	},
	/* HELPERS */
	/**
	 * Add listeners to data
	 * @private
	 */
	_addListeners: function() {
		const self = this;

		self._addSyncListener();
	},
	/**
	 * Add listener to isSync flag.
	 * @private
	 */
	_addSyncListener: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// reload players from server if isSync is false.
		binding.sub('isSync').addListener(descriptor => !descriptor.getCurrentValue() && self._loadPlayers());
	},
	/**
	 * Load team players from server
	 * @private
	 */
	_loadPlayers: function() {
		const self = this;

		const event = self.getBinding('event').toJS();

		event && self._setPlayersFromEventToBinding(event);
	},
	_setPlayersFromEventToBinding: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		Promise
			.all(event.participants.map(team => self._getTeamPLayers(team)))
			.then(players => binding.atomically()
								.set('viewPlayers.players',	Immutable.fromJS(players))
								.set("editPlayers.players",	Immutable.fromJS(players))
								.set('isSync',				Immutable.fromJS(true))
								.commit()
			);
	},
	_getTeamPLayers: function(team) {
		return window.Server.teamPlayers.get(
			{
				schoolId:	team.schoolId,
				teamId:		team.id
			},
			{
				filter: {
					limit: 100
				}
			}
		);
	},
	_getEditPlayersBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:	binding.sub('editPlayers'),
			event:		self.getBinding('event'),
			points:		self.getBinding('points'),
			schoolInfo:	self.getBinding('schoolInfo'),
			mode:		self.getBinding('mode')
		};
	},
	_getViewPlayersBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:	binding.sub('viewPlayers'),
			event:		self.getBinding('event'),
			points:		self.getBinding('points'),
			mode:		self.getBinding('mode')
		};
	},
	/* RENDERS */
	_renderTeams: function() {
		const self = this;

		const mode = self.getBinding('mode').toJS();

		let result;

		switch (mode) {
			case 'edit_squad':
				result = (
					<EventTeamsEdit binding={self._getEditPlayersBinding()} />
				);
				break;
			case 'general':
			case 'closing':
				result = (
					<EventTeamsView binding={self._getViewPlayersBinding()} />
				);
				break;
		}

		return result;
	},
	render: function() {
		const self = this;

		return (
			<div>
				{self._renderTeams()};
			</div>
		);
	}
});

module.exports = EventTeams;