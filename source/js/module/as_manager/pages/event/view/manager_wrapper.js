const	React 							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable');

const	Manager							= require('./../../../../ui/managers/manager'),
		EventHelper						= require('./../../../../helpers/eventHelper'),
		Button							= require('../../../../ui/button/button'),
		classNames						= require('classnames'),
		TeamHelper						= require('./../../../../ui/managers/helpers/team_helper');

const	Actions							= require('../actions/actions'),
		SavingPlayerChangesPopup		= require('../../events/saving_player_changes_popup/saving_player_changes_popup'),
		SavingPlayerChangesPopupHelper	= require('../../events/saving_player_changes_popup/helper'),
		SavingEventHelper				= require('../../../../helpers/saving_event_helper'),
		ManagerHelper					= require('../../../../ui/managers/helpers/manager_helper');

const	TeamManagerWrapperStyle			= require('../../../../../../styles/ui/b_team_manager_wrapper.scss');

const ManagerWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		const	self						= this,
				binding						= self.getDefaultBinding(),
				index 						= binding.get('selectedRivalIndex'),
				selectedRivalIndex 			= index !== undefined ? index : 0,
				teamManagerWrapperBinding	= binding.sub('teamManagerWrapper.default');

		const event = binding.toJS('model');

		binding.set('isTeamManagerSync', false);

		teamManagerWrapperBinding.atomically()
			.set('isSubmitProcessing',				false)
			.set('isSavingChangesModePopupOpen',	false)
			.set('model',							Immutable.fromJS(event))
			.set('model.sportModel',				Immutable.fromJS(event.sport))
			.set('rivals',							Immutable.fromJS(self.getRivals()))
			.set('schoolInfo',						Immutable.fromJS(event.inviterSchoolId === this.props.activeSchoolId ? event.inviterSchool : event.invitedSchools[0]))
			.set('selectedRivalIndex',				Immutable.fromJS(selectedRivalIndex))
			.set('error',							Immutable.fromJS([
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

		this.addListeners();
	},
	addListeners: function() {
		this.addListenerForTeamManager();
	},
	addListenerForTeamManager: function() {
		const binding = this.getDefaultBinding();

		binding
			.sub(`teamManagerWrapper.default.isSync`)
			.addListener(eventDescriptor => {
				// Lock submit button if team manager in searching state.
				eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', true);

				// Unlock submit button if team manager in searching state.
				!eventDescriptor.getCurrentValue() && binding.set('isTeamManagerSync', false);
			});
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

		const	event			= binding.toJS('model');
		let		rival;

		// Add school or house
		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				let school;
				switch (order) {
					case 0:
						school = event.inviterSchool.id === this.props.activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
						break;
					case 1:
						school = event.inviterSchool.id !== this.props.activeSchoolId ? event.inviterSchool : event.invitedSchools[0];
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
						players = event.individualsData.filter(p => p.schoolId === this.props.activeSchoolId);
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
				const t = teams.find(t => t.schoolId === this.props.activeSchoolId);
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
						const t = teams.find(t => t.schoolId === this.props.activeSchoolId);
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
			this.props.activeSchoolId,
			binding.toJS(`teamManagerWrapper.default.rivals`),
			binding.toJS('teamManagerWrapper.default.model'),
			this.getTeamWrappers()
		)
	},
	handleClickPopupSubmit: function() {
		this.submit();
	},
	handleClickCancelButton: function() {
		this.getDefaultBinding().set('mode', 'general');
	},
	getValidationData: function() {
		const	self	= this,
			binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(EventHelper.isInterSchoolsEvent(event)) {
			return [
				binding.toJS('teamManagerWrapper.default.error.0')
			];
		} else {
			return [
				binding.toJS('teamManagerWrapper.default.error.0'),
				binding.toJS('teamManagerWrapper.default.error.1')
			];
		}
	},
	getTeamWrappers: function() {
		return this.getDefaultBinding().toJS('teamManagerWrapper.default.teamModeView.teamWrapper');
	},
	handleClickSubmitButton: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				teamWrappers	= this.getTeamWrappers(),
				validationData	= this.getValidationData();

		// if true - then user click to finish button
		// so we shouldn't do anything
		if(
			binding.get('isTeamManagerSync') &&
			!binding.toJS('teamManagerWrapper.default.isSubmitProcessing') &&
			TeamHelper.isTeamDataCorrect(event, validationData)
		) {

			binding.set('isSubmitProcessing', true);
			this.submit();
			//switch (true) {
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		this.showSavingChangesModePopup();
			//		break;
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		this.showSavingChangesModePopup();
			//		break;
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		this.showSavingChangesModePopup();
			//		break;
			//	case (
			//			TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isTeamSport(event) &&
			//			!SavingPlayerChangesPopupHelper.isAnyTeamChanged(event, teamWrappers) && !SavingPlayerChangesPopupHelper.isUserCreateNewTeam(event, teamWrappers)
			//	):
			//		binding.set('isSubmitProcessing', true);
			//		this.submit();
			//		break;
			//	case TeamHelper.isTeamDataCorrect(event, validationData) && TeamHelper.isNonTeamSport(event):
			//		binding.set('isSubmitProcessing', true);
			//		this.submit();
			//		break;
			//}
		}
	},
	showSavingChangesModePopup: function() {
		this.getDefaultBinding().set('teamManagerWrapper.default.isSavingChangesModePopupOpen', true);
	},
	doAfterCommitActions: function() {
		// just go to event page
		window.location.reload();
	},
	submit: function() {
		const binding = this.getDefaultBinding();

		//return Promise.all(this.processSavingChangesMode())
		//	.then(() => Actions.submitAllChanges(this.activeSchoolId, binding))
		//	.then(() => this.doAfterCommitActions());

		return Actions.submitAllChanges(this.props.activeSchoolId, binding).then(() => this.doAfterCommitActions());
	},
	getSaveButtonStyleClass: function() {
		return classNames({
			'mMarginRight'	: true,
			'mDisable'		: !this.getDefaultBinding().get('isTeamManagerSync')
		});
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				managerBinding	= this.getManagerBinding();

		return (
			<div className="bTeamManagerWrapper">
				<Manager	binding					= {managerBinding}
							indexOfDisplayingRival	= {binding.toJS('selectedRivalIndex')}
				/>
				<SavingPlayerChangesPopup	binding	= {binding.sub('teamManagerWrapper.default')}
											submit	= {this.handleClickPopupSubmit}
				/>
				<div className="eTeamManagerWrapper_footer">
					<Button	text				= "Save"
							onClick				= {this.handleClickSubmitButton}
							extraStyleClasses	= {this.getSaveButtonStyleClass()}
					/>
					<Button	text				= "Cancel"
							onClick				= {this.handleClickCancelButton}
							extraStyleClasses	= {"mCancel"}
					/>
				</div>
			</div>
		);
	}
});

module.exports = ManagerWrapper;