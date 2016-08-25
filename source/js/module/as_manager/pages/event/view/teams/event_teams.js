const	InvitesMixin			= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventTeamsView			= require('./event_teams_view'),
		EventTeamsEdit			= require('./event_teams_edit'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		EventHelper				= require('module/helpers/eventHelper'),
		MoreartyHelper			= require('module/helpers/morearty_helper'),
		TeamPlayersValidator	= require('./../../../../../ui/managers/helpers/team_players_validator'),
		React					= require('react'),
		Immutable				= require('immutable'),
		Morearty				= require('morearty');

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
				],
				validationData: [
					{
						isError: false,
						text: ''
					},
					{
						isError: false,
						text: ''
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
		self.addTeamPlayersListener();
	},
	addTeamPlayersListener: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('event').toJS();

		binding.sub('editPlayers.teamManagerBindings.0.teamStudents').addListener(() => {
			self.validate(0);
		});
		if(!EventHelper.isEventWithOneIndividualTeam(event) || TeamHelper.isOneOnOneSport(event)) {
			binding.sub('editPlayers.teamManagerBindings.1.teamStudents').addListener(() => {
				self.validate(1);
			});
		}
	},
	validate: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	defaultLimits	= self.getBinding('event').toJS('sport.defaultLimits'),
				limits			= defaultLimits ? {
									maxPlayers:	defaultLimits.maxPlayers,
									minPlayers:	defaultLimits.minPlayers,
									minSubs:	defaultLimits.minSubs,
									maxSubs:	defaultLimits.maxSubs
								} : {},
				teamStudents	= binding.toJS(`editPlayers.teamManagerBindings.${order}.teamStudents`);

		const result = TeamPlayersValidator.validate(
			teamStudents,
			limits
		);

		binding.set(`editPlayers.validationData.${order}`, Immutable.fromJS(result));
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

		if(event && TeamHelper.isNonTeamSport(event)) {
			self.setNonTeamPlayersToBinding(event);
		} else {
			self._setTeamPlayersFromEventToBinding(event);
		}
	},
	setNonTeamPlayersToBinding: function(event) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	editPlayers = [],
				viewPlayers = [];

		const eventType = EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];

		window.Server.schoolEvent.get(
				{
					schoolId:	self.activeSchoolId,
					eventId:	event.id
				}
			)
			.then(event => {
				self.getBinding('event').set(
					'individualsData',
					Immutable.fromJS(event.individualsData)
				);

				if(eventType === 'internal' && TeamHelper.isIndividualSport(event)) {
					binding.atomically()
						.set('viewPlayers.players',								Immutable.fromJS(event.individualsData))
						.set("editPlayers.teamManagerBindings.0.teamStudents",	Immutable.fromJS(event.individualsData))
						.set("editPlayers.teamManagerBindings.0.blackList",		Immutable.fromJS([]))
						.set("editPlayers.teamManagerBindings.0.removedPlayers",Immutable.fromJS([]))
						.set("editPlayers.teamManagerBindings.0.positions",		Immutable.fromJS([]))
						.set("editPlayers.teamManagerBindings.0.isSync",		Immutable.fromJS(false))
						.set('isSync',											Immutable.fromJS(true))
						.commit();
				} else {
					switch (eventType) {
						case 'inter-schools':
							binding.atomically()
								.set('viewPlayers.players',								Immutable.fromJS(event.individualsData))
								.set("editPlayers.teamManagerBindings.0.teamStudents",
									Immutable.fromJS(
										event.individualsData.filter(p => p.schoolId === self.activeSchoolId)
									)
								)
								.set("editPlayers.teamManagerBindings.0.blackList",		Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.0.removedPlayers",Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.0.positions",		Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.0.isSync",		Immutable.fromJS(false))
								.set('isSync',											Immutable.fromJS(true))
								.commit();
							break;
						case 'houses':
						case 'internal':
							binding.atomically()
								.set('viewPlayers.players',								Immutable.fromJS(event.individualsData))
								.set("editPlayers.teamManagerBindings.0.teamId",		Immutable.fromJS(eventType === 'houses' ? event.houses[0] : 0))
								.set("editPlayers.teamManagerBindings.0.teamStudents",
									Immutable.fromJS(
										eventType === 'houses' ?
											event.individualsData.filter(p => p.houseId === event.houses[0]) :
											self.getIndividualsByOrder(event, 0)
									)
								)
								.set("editPlayers.teamManagerBindings.0.blackList",		Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.0.removedPlayers",Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.0.positions",		Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.0.isSync",		Immutable.fromJS(false))
								.set("editPlayers.teamManagerBindings.1.teamId",		Immutable.fromJS(eventType === 'houses' ? event.houses[1] : 1))
								.set("editPlayers.teamManagerBindings.1.teamStudents",
									Immutable.fromJS(
										eventType === 'houses' ?
											event.individualsData.filter(p => p.houseId === event.houses[1]) :
											self.getIndividualsByOrder(event, 1)
									)
								)
								.set("editPlayers.teamManagerBindings.1.blackList",		Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.1.removedPlayers",Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.1.positions",		Immutable.fromJS([]))
								.set("editPlayers.teamManagerBindings.1.isSync",		Immutable.fromJS(false))
								.set('isSync',											Immutable.fromJS(true))
								.commit();
							break;
					}
				}
			});
	},
	getIndividualsByOrder: function(event, order) {
		return event.individualsData[order] ? [event.individualsData[order]] : [];
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
			.then(teamPlayers => {
				const event = self.getBinding('event').toJS();

				binding
					.atomically()
					.set('viewPlayers.players',								Immutable.fromJS(
						teamPlayers.map(tp => tp.viewPlayers)
					))
					// TEAM ID's
					.set("editPlayers.teamManagerBindings.0.teamId",		Immutable.fromJS(
						self.getTeamIdByOrder(teamPlayers, 0)
					))
					.set("editPlayers.teamManagerBindings.1.teamId",		Immutable.fromJS(
						self.getTeamIdByOrder(teamPlayers, 1)
					))
					// TEAM STUDENTS
					.set("editPlayers.teamManagerBindings.0.teamStudents",	Immutable.fromJS(
						self.getTeamStudentsByOrder(teamPlayers, 0)
					))
					.set("editPlayers.teamManagerBindings.1.teamStudents",	Immutable.fromJS(
						self.getTeamStudentsByOrder(teamPlayers, 1)
					))
					// BLACKLIST
					.set("editPlayers.teamManagerBindings.0.blackList",		Immutable.fromJS(
						self.getTeamStudentsByOrder(teamPlayers, 1)
					))
					.set("editPlayers.teamManagerBindings.1.blackList",		Immutable.fromJS(Immutable.fromJS(
						self.getTeamStudentsByOrder(teamPlayers, 0)
					))
					// REMOVED PLAYERS
					.set("editPlayers.teamManagerBindings.0.removedPlayers",Immutable.fromJS([]))
					.set("editPlayers.teamManagerBindings.1.removedPlayers",Immutable.fromJS([]))
					// IS SYNC
					.set("editPlayers.teamManagerBindings.0.isSync",		Immutable.fromJS(false))
					.set("editPlayers.teamManagerBindings.1.isSync",		Immutable.fromJS(false))
					// POSITIONS
					.set("editPlayers.teamManagerBindings.0.positions",		Immutable.fromJS(
						self.getEventSportPositions(event))
					))
					.set("editPlayers.teamManagerBindings.1.positions",		Immutable.fromJS(
						self.getEventSportPositions(event)
					))
					// GLOBAL SYNC
					.set('isSync',											Immutable.fromJS(true))
					.commit();
			});
	},
	/**
	 * Small helper function
	 * Return positions from event
	 */
	getEventSportPositions: function(event) {
		if(
			event &&
			event.sportModel &&
			event.sportModel.field &&
			event.sportModel.field.positions
		) {
			return event.sportModel.field.positions;
		} else {
			return [];
		}
	},
	/**
	 * Small helper function
	 * Just replace not exist team by empty team,
	 * or if team is exist then return team
	 */
	getTeamStudentsByOrder: function(teams, order) {
		if(teams && teams[order]) {
			return teams[order].editPlayers;
		} else {
			return [];
		}
	},
	/**
	 * Small helper function
	 * Just replace id of not exist team by undefined,
	 * or if team is exist then return teamId
	 */
	getTeamIdByOrder: function(teams, order) {
		if(teams && teams[order]) {
			return teams[order].teamId;
		} else {
			return undefined;
		}
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