/**
 * Created by Woland on 10.01.2017.
 */
const 	React 				= require('react'),
		Immutable			= require('immutable'),
		Morearty 			= require('morearty'),

		ChallengeModel		= require('module/ui/challenges/challenge_model'),

		MoreartyHelper		= require('module/helpers/morearty_helper'),
		RoleHelper			= require('module/helpers/role_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),

		EventHeader 		= require('./event_header'),
		EventHeaderActions 	= require('./event_header_actions');

const EventHeaderWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},

	/**
	 * The event handler when clicking the button "Cancel"
	 */
	handleClickCancelEvent: function () {
		const 	binding		= this.getDefaultBinding(),
				schoolId 	= MoreartyHelper.getActiveSchoolId(this),
				eventId 	= binding.toJS('model.id');

		EventHeaderActions.cancelEvent(schoolId, eventId);
	},

	/**
	 * The event handler when clicking the button "Change score" or "Close event"
	 */
	handleClickCloseEvent: function () {
		const binding = this.getDefaultBinding();

		this.backupResults();
		EventHeaderActions.setModeClosing(binding);
	},
	backupResults: function() {
		const binding = this.getDefaultBinding();

		// backup results
		// we need default state of results for revert event result changes
		// when user click to cancel button(in close event mode)
		const event = binding.toJS('model');
		event.initResults = event.results;
		binding.set('model', Immutable.fromJS(event));
	},
	/**
	 * The event handler when clicking the button "Cancel" after clicking the button "Change score"
	 */
	onClickCloseCancel: function () {
		const	binding	= this.getDefaultBinding();

		EventHeaderActions.setModeGeneral(binding);
		EventHeaderActions.revertScore(binding);
	},

	/**
	 * The event handler when clicking the button "Save" after clicking the button "Change score"
	 */
	onClickOk: function () {
		const 	binding 		= this.getDefaultBinding(),
				event 			= binding.toJS('model'),
				activeSchoolId 	= MoreartyHelper.getActiveSchoolId(this);

		if(this.getDefaultBinding().get('model.status') === "FINISHED") {
			EventHeaderActions.submitScore(activeSchoolId, event, binding);
		} else {
			EventHeaderActions.closeMatch(activeSchoolId, event, binding);
		}
	},
	onClickEditEventButton: function() {
		const binding = this.getDefaultBinding();

		binding.set('isEditEventPopupOpen', true);
	},
	/**
	 * The function render's component EventHeaderWrapper
	 * @returns {XML}
	 */
	render: function() {
		const 	binding 						= this.getDefaultBinding(),
				event 							= new ChallengeModel(binding.toJS('model'), this.props.activeSchoolId),
				mode 							= binding.toJS('mode'),
				eventStatus						= binding.toJS('model.status'),
				eventAges						= binding.toJS('model.ages'),
				isUserSchoolWorker 				= RoleHelper.isUserSchoolWorker(this),
				isShowScoreEventButtonsBlock 	= TeamHelper.isShowScoreEventButtonsBlock(this);

		return (
					<EventHeader
						event 							= { event }
						mode 							= { mode }
						eventStatus 					= { eventStatus }
						eventAges						= { eventAges }
						isUserSchoolWorker 				= { isUserSchoolWorker }
						isShowScoreEventButtonsBlock 	= { isShowScoreEventButtonsBlock }
						handleClickCancelEvent			= { this.handleClickCancelEvent }
						handleClickCloseEvent			= { this.handleClickCloseEvent }
						onClickCloseCancel				= { this.onClickCloseCancel }
						onClickOk						= { this.onClickOk }
						onClickEditEventButton			= { this.onClickEditEventButton }
					/>
		);
	}
});

module.exports = EventHeaderWrapper;