const	Morearty					= require('morearty'),
		Immutable					= require('immutable'),
		React 						= require('react'),
		Manager						= require('./../../../../ui/managers/manager'),
		EventHelper					= require('./../../../../helpers/eventHelper'),
		TeamHelper					= require('./../../../../ui/managers/helpers/team_helper'),
		MoreartyHelper				= require('./../../../../helpers/morearty_helper'),

		Actions						= require('../actions/actions'),
		SavingPlayerChangesPopup	= require('../../events/saving_player_changes_popup/saving_player_changes_popup'),
		SavingEventHelper			= require('../../../../helpers/saving_event_helper');

const ManagerWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const	self						= this,
				binding						= self.getDefaultBinding(),
				teamManagerWrapperBinding	= binding.sub('teamManagerWrapper.default');

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const event = binding.toJS('model');

		teamManagerWrapperBinding.atomically()
			.set('model',				Immutable.fromJS(event))
			.set('model.sportModel',	Immutable.fromJS(event.sport))
			.set('rivals',				Immutable.fromJS(self.getRivals()))
			.set('schoolInfo',			Immutable.fromJS(event.inviterSchoolId === self.activeSchoolId ? event.inviterSchool : event.invitedSchools[0]))
			.set('selectedRivalIndex',	Immutable.fromJS(0))
			.set('error',				Immutable.fromJS([
											{
												isError: false,
												text: ""
											},
											{
												isError: false,
												text: ""
											}
										]))
			.commit();
	},
	getRivals: function() {
		const self = this;

		const rivals = [
				self.getRivalByOrder(0),
				self.getRivalByOrder(1)
		];

		return rivals;
	},
	getRivalByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(self);

		let		rival;

		// Add school or house
		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				let school;
				switch (order) {
					case 0:
						school = event.inviterSchool.id === activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
						break;
					case 1:
						school = event.inviterSchool.id !== activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
						break;
				}
				rival = {
					id:			school.id,
					name:		school.name
				};
				break;
			case EventHelper.isHousesEvent(event):
				rival = {
					id:			event.housesData[order].id,
					name:		event.housesData[order].name
				};
				break;
			case EventHelper.isInternalEvent(event):
				rival = {
					id:			null,
					name:		null
				};
				break;
		}

		// Add team players
		rival.players = self.getPlayersByOrder(order);

		// Add team
		if(TeamHelper.isTeamSport(event)) {
			rival.team = self.getTeamByOrder(order);
		}

		return rival;
	},
	getPlayersByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();
		let		result;

		const event = binding.toJS('model');

		if(event) {
			switch (true) {
				case TeamHelper.isNonTeamSport(event):
					result = self.getNonTeamPlayersByOrder(order);
					break;
				case TeamHelper.isTeamSport(event):
					result = self.getTeamPlayersByOrder(order);
					break;
			}
		}

		return result;
	},
	getNonTeamPlayersByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event		= binding.toJS('model'),
				eventType	= EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];

		let players;

		switch(eventType) {
			case 'inter-schools':
				switch (order) {
					case 0:
						players = event.individualsData.filter(p => p.schoolId === self.activeSchoolId);
						break;
					case 1:
						players = [];
						break;
				};
				break;
			case 'houses':
				players = event.individualsData.filter(p => p.houseId === event.houses[order])
				break;
			case 'internal':
				players = self.getNonTeamPlayersForInternalEvent(order);
				break;
		}

		return players;
	},
	getNonTeamPlayersForInternalEvent: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		let players;

		switch (true) {
			case TeamHelper.isIndividualSport(event):
				switch (order) {
					case 0:
						players = event.individualsData;
						break;
					case 1:
						players = [];
						break;
				};
				break;
			case TeamHelper.isOneOnOneSport(event):
				switch (event.individualsData.length) {
					case 0:
						players = [];
						break;
					case 1:
						switch (order) {
							case 0:
								players = [event.individualsData[0]];
								break;
							case 1:
								players = [];
								break;
						}
						break;
					case 2:
						players = [event.individualsData[order]];
						break;
				}
				break;
		}

		return players;
	},
	getTeamPlayersByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');
		const teams = binding.toJS('model.teamsData');

		if(EventHelper.isInterSchoolsEvent(binding.toJS('model'))) {
			if(order === 0) {
				const t = teams.find(t => t.schoolId === MoreartyHelper.getActiveSchoolId(self));
				return typeof t === 'undefined' ? [] : t.players;
			} else {
				return [];
			}
		} else if(EventHelper.isHousesEvent(binding.toJS('model'))) {
			const t = teams.find(t => t.houseId === event.housesData[order].id);

			if(typeof t !== 'undefined') {
				return t.players;
			} else {
				return [];
			}
		} else {
			return teams && teams[order] ? teams[order].players : [];
		}
	},
	getTeamByOrder: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();
		let		team;

		const event = binding.toJS('model');

		const teams = binding.toJS('model.teamsData');

		switch (true) {
			case TeamHelper.isTeamSport(event):
				if(EventHelper.isInterSchoolsEvent(binding.toJS('model'))) {
					if(order === 0) {
						const t = teams.find(t => t.schoolId === MoreartyHelper.getActiveSchoolId(self));
						team = t;
					} else {
						team = undefined;
					}
				} else if(EventHelper.isHousesEvent(binding.toJS('model'))) {
					team = teams.find(t => t.houseId === event.housesData[order].id);
				} else {
					team = teams ? teams[order] : undefined;
				}
				break;
		}

		return team;
	},
	getManagerBinding: function() {
		const	self						= this,
				binding						= self.getDefaultBinding(),
				teamManagerWrapperBinding	= binding.sub('teamManagerWrapper');

		return {
			default:			teamManagerWrapperBinding.sub('default'),
			selectedRivalIndex:	teamManagerWrapperBinding.sub('default.selectedRivalIndex'),
			rivals:				teamManagerWrapperBinding.sub('default.rivals'),
			error:				teamManagerWrapperBinding.sub('default.error')
		};
	},
	/**
	 * Just wrapper.
	 * @returns {*}
	 */
	processSavingChangesMode: function() {
		const binding = this.getDefaultBinding();

		return SavingEventHelper.processSavingChangesMode(
			this.activeSchoolId,
			binding.toJS(`rivals`),
			binding.toJS('model'),
			binding.toJS(`teamModeView.teamWrapper`)
		)
	},
	handleClickPopupSubmit: function() {
		const binding = this.getDefaultBinding();

		return Promise.all(this.processSavingChangesMode()).then(() => Actions.submitAllChanges(this.activeSchoolId, binding));
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				managerBinding	= this.getManagerBinding();

		return (
			<div>
				<Manager binding={managerBinding}/>
				<SavingPlayerChangesPopup	binding	= {binding}
											submit	= {this.handleClickPopupSubmit}
				/>
			</div>
		);
	}
});

module.exports = ManagerWrapper;