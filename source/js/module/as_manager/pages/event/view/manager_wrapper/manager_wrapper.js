const	React 							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable');

const	Manager							= require('./../../../../../ui/managers/manager'),
		EventHelper						= require('./../../../../../helpers/eventHelper'),
		ManagerWrapperHelper			= require('./manager_wrapper_helper'),
		NewManagerWrapperHelper			= require('./new_manager_wrapper_helper'),
		Button							= require('../../../../../ui/button/button'),
		classNames						= require('classnames'),
		TeamHelper						= require('./../../../../../ui/managers/helpers/team_helper');

const	Actions							= require('../../actions/actions'),
		SavingPlayerChangesPopup		= require('../../../events/saving_player_changes_popup/saving_player_changes_popup'),
		SavingPlayerChangesPopupHelper	= require('../../../events/saving_player_changes_popup/helper'),
		SavingEventHelper				= require('../../../../../helpers/saving_event_helper'),
		ManagerHelper					= require('../../../../../ui/managers/helpers/manager_helper');

const	TeamManagerWrapperStyle			= require('../../../../../../../styles/ui/b_team_manager_wrapper.scss');

const ManagerWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		let selectedRivalIndex = binding.get('selectedRivalIndex');
		typeof selectedRivalIndex === 'undefined' && (selectedRivalIndex = 0);

		binding.set('isTeamManagerSync', false);

		const event = binding.toJS('model');

		const rivals = this.getRivals(event, binding.toJS('rivals'));

		binding.sub('teamManagerWrapper.default').atomically()
			.set('isSubmitProcessing',				false)
			.set('isSavingChangesModePopupOpen',	false)
			.set('model',							Immutable.fromJS(event))
			.set('model.sportModel',				Immutable.fromJS(event.sport))
			.set('rivals',							Immutable.fromJS(rivals))
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

		console.log(rivals);

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
	getRivals: function(event, rivals) {
		if(
			(
				TeamHelper.isHousesEventForTeamSport(event) ||
				TeamHelper.isInternalEventForTeamSport(event)
			) && event.sport.multiparty
		) {
			return NewManagerWrapperHelper.getRivals(event, rivals);
		} else {
			return ManagerWrapperHelper.getRivals(this.props.activeSchoolId, event, false);
		}
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
			'mMarginLeftFixed'	: true
		});
	},
	isShowRivals: function() {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model');

		return (
			!TeamHelper.isInternalEventForIndividualSport(event) &&
			!TeamHelper.isInternalEventForTeamSport(event)
		)
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				managerBinding	= this.getManagerBinding();

		// provide isShowRivals by isInviteMode is a trick
		return (
			<div className="bTeamManagerWrapper">
				<Manager	binding					= {managerBinding}
							isShowRivals			= {this.isShowRivals()}
							isShowAddTeamButton		= {false}
							indexOfDisplayingRival	= {binding.toJS('selectedRivalIndex')}
				/>
				<SavingPlayerChangesPopup	binding	= {binding.sub('teamManagerWrapper.default')}
											submit	= {this.handleClickPopupSubmit}
				/>
				<div className="eTeamManagerWrapper_footer">
					<Button	text				= "Cancel"
							onClick				= {this.handleClickCancelButton}
							extraStyleClasses	= {"mCancel"}
						/>
					<Button	text				= "Save"
							onClick				= {this.handleClickSubmitButton}
							extraStyleClasses	= {this.getSaveButtonStyleClass()}
					/>
				</div>
			</div>
		);
	}
});

module.exports = ManagerWrapper;