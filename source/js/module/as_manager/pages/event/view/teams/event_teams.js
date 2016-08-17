const	InvitesMixin		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventTeamsView		= require('./event_teams_view'),
		EventTeamsEdit		= require('./event_teams_edit'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		EventHelper			= require('module/helpers/eventHelper'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		React				= require('react'),
		Immutable			= require('immutable'),
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
				'teamManagerBindings': [
					{
						teamId:			undefined,
						teamStudents:	[],
						foundStudents:	[],
						removedPlayers:	[],
						positions:		[],
						blackList:		[]
					},
					{
						teamId:			undefined,
						teamStudents:	[],
						foundStudents:	[],
						removedPlayers:	[],
						positions:		[],
						blackList:		[]
					}
				]
			},
			isSync: false
		});
	},
	componentWillMount: function() {
		const self = this;

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

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

		if(event && TeamHelper.isIndividualSport(event)) {
			self._setIndividualPlayersFromEventToBinding(event);
		} else {
			self._setTeamPlayersFromEventToBinding(event);
		}
	},
	_setIndividualPlayersFromEventToBinding: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	editPlayers = [],
				viewPlayers = [];

		window.Server.schoolEvent.get(
				{
					schoolId:	self.activeSchoolId,
					eventId:	event.id
				}
			)
			.then(event => {
				binding.atomically()
					.set('viewPlayers.players',								Immutable.fromJS(event.individualsData))
					.set("editPlayers.teamManagerBindings.0.teamStudents",	Immutable.fromJS(event.individualsData))
					.set("editPlayers.teamManagerBindings.0.blackList",		Immutable.fromJS([]))
					.set("editPlayers.teamManagerBindings.0.removedPlayers",Immutable.fromJS([]))
					.set("editPlayers.teamManagerBindings.0.positions",		Immutable.fromJS([]))
					.set("editPlayers.teamManagerBindings.0.isSync",		Immutable.fromJS(false))
					.set('isSync',											Immutable.fromJS(true))
					.commit();
			});
	},
	_setTeamPlayersFromEventToBinding: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		Promise.all(event.teamsData.map(team => {
				return self._getTeamPLayers(team)
					// filter some players - not all players in event.teamsData available for edit
					// players from another school not available for edit
					.then(players => {
						const result = {
							teamId:			team.id,
							viewPlayers:	players,
							editPlayers:	[]
						};

						if(EventHelper.isInterSchoolsEvent(event)) {
							team.schoolId === self.activeSchoolId && (result.editPlayers = players);
						} else {
							result.editPlayers = players;
						}

						return result;
					});
			}))
			// TODO not work for teams count great then 2
			.then(teamPlayers => {
				binding.atomically()
					.set('viewPlayers.players',								Immutable.fromJS(teamPlayers.map(tp => tp.viewPlayers)))
					.set("editPlayers.teamManagerBindings.0.teamId",		Immutable.fromJS(teamPlayers[0].teamId))
					.set("editPlayers.teamManagerBindings.0.teamStudents",	Immutable.fromJS(teamPlayers[0].editPlayers))
					.set("editPlayers.teamManagerBindings.0.blackList",		Immutable.fromJS(teamPlayers[1] ? teamPlayers[1].editPlayers : []))
					.set("editPlayers.teamManagerBindings.0.removedPlayers",Immutable.fromJS([]))
					.set("editPlayers.teamManagerBindings.0.isSync",		Immutable.fromJS(false))
					.set("editPlayers.teamManagerBindings.0.positions",		Immutable.fromJS(
						self.getBinding('event').toJS().sportModel.field.positions ?
							self.getBinding('event').toJS().sportModel.field.positions :
							[]
					))
					// if event type is inter schools - second team can not exist
					.set("editPlayers.teamManagerBindings.1.teamId",		Immutable.fromJS(teamPlayers[1] ? teamPlayers[1].teamId : undefined))
					.set("editPlayers.teamManagerBindings.1.teamStudents",	Immutable.fromJS(teamPlayers[1] ? teamPlayers[1].editPlayers : []))
					.set("editPlayers.teamManagerBindings.1.blackList",		Immutable.fromJS(teamPlayers[1] ? teamPlayers[0].editPlayers : []))
					.set("editPlayers.teamManagerBindings.1.removedPlayers",Immutable.fromJS([]))
					.set("editPlayers.teamManagerBindings.1.isSync",		Immutable.fromJS(false))
					.set("editPlayers.teamManagerBindings.1.positions",		Immutable.fromJS(
						self.getBinding('event').toJS().sportModel.field.positions ?
							self.getBinding('event').toJS().sportModel.field.positions :
							[]
					))
					.set('isSync',											Immutable.fromJS(true))
					.commit();
			});
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
				{self._renderTeams()}
			</div>
		);
	}
});

module.exports = EventTeams;