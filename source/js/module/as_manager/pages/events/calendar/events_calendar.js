/**
 * Created by Anatoly on 26.09.2016.
 */

const 	React				= require('react'),
		Challenges			= require('./../../../../ui/challenges/challenges'),
		Calendar			= require('./calendar'),
		CalendarActions		= require('./calendar-actions'),
		Morearty			= require('morearty'),
		AddEventButton		= require('./add_event_button'),
		EventHeaderActions 	= require('module/as_manager/pages/event/view/event_header/event_header_actions'),
		ConfirmPopup 		= require('module/ui/confirm_popup'),
		RoleHelper 			= require('module/helpers/role_helper'),
		EventsStyles		= require('./../../../../../../styles/pages/events/b_events.scss');

/** Show calendar section: month calendar and events for selected date */
const EventsCalendar = React.createClass({
	mixins:[Morearty.Mixin ],

	componentWillMount: function () {
		const	binding					= this.getDefaultBinding(),
				activeSchoolId			= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
		
		binding.set('isSyncSlider', false);
		/** Loading initial data for this month */
		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
		
		if (this.isSchoolWorker()) {
			window.Server.profile.get().then(p => {
				binding.set('isSyncSlider', true);
				binding.set('webIntroEnabled', p.webIntroEnabled);
				binding.set('webIntroShowTimes', p.webIntroShowTimes);
			});
		}
	},
	
	onEventClick: function(eventId){
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},
	
	onDeleteEvent: function(eventId){
		const binding = this.getDefaultBinding();

		binding.atomically()
			.set("deleteEventId", eventId)
			.set("isDeleteEventPopupOpen", true)
			.commit();
	},
	
	renderDeleteEventPopupOpen: function() {
		const binding	= this.getDefaultBinding();
		
		if(binding.get("isDeleteEventPopupOpen")) {
			return (
				<ConfirmPopup	okButtonText			= "Delete"
								cancelButtonText		= "Cancel"
								isOkButtonDisabled		= { false }
								handleClickOkButton		= { this.handleClickDeleteButton }
								handleClickCancelButton	= { this.handleCancelDeleteEventPopup }
				>
					<div>Are you sure you want to delete the selected event?</div>
				</ConfirmPopup>
			)
		} else {
			return null;
		}
	},
	
	handleClickDeleteButton: function(){
		const 	activeSchoolId 	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding 		= this.getDefaultBinding(),
				selectedDate 	= typeof binding.toJS('selectedDate') !== 'undefined' ? binding.toJS('selectedDate') : new Date(),
				eventId 		= binding.toJS("deleteEventId");
		
		EventHeaderActions.deleteEvent(activeSchoolId, eventId).then( () => {
			binding.set("isDeleteEventPopupOpen", false);
			window.simpleAlert(
				'Event has been successfully deleted',
				'Ok',
				() => {
					CalendarActions.setSelectedDate(selectedDate, activeSchoolId, binding);
				}
			);
		});
	},
	
	handleCancelDeleteEventPopup: function() {
		const binding = this.getDefaultBinding();
		
		binding.set("isDeleteEventPopupOpen", false);
	},
	
	handleClickAddEventButton: function() {
		document.location.hash = 'events/manager';
	},
	
	isSchoolWorker: function () {
		const	role		= RoleHelper.getLoggedInUserRole(this),
				schoolKind	= RoleHelper.getActiveSchoolKind(this);
		
		return typeof role !== "undefined" && schoolKind === "School";
	},

	render: function(){
		const	binding						= this.getDefaultBinding(),
				activeSchoolId				= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				sliderWasOpened				= this.getMoreartyContext().getBinding().get('sliderHelpAlert.wasOpened'),
				isSelectedDateEventsInSync	= binding.get('selectedDateEventsData.isSync'),
				isUserSchoolWorker 			= RoleHelper.isUserSchoolWorker(this),
				selectedDateEvents			= binding.toJS('selectedDateEventsData.events'),
				showSlider	 				= binding.get('isSyncSlider') && binding.get('webIntroEnabled');

		if (showSlider && !sliderWasOpened) {
			window.sliderAlert(
				binding.get('webIntroEnabled'),
				binding.get('webIntroShowTimes')
			);
		}
		return (
			<div className="bEvents">
				<div className="eEvents_container">
					<div className="eEvents_row">
						<div className="eEvents_leftSideContainer">
							<Calendar binding={binding}/>
						</div>
						<div className="eEvents_rightSideContainer">
							<Challenges activeSchoolId 		= { activeSchoolId }
										isSync 				= { isSelectedDateEventsInSync }
										events 				= { selectedDateEvents }
										onClick 			= { this.onEventClick }
										onClickDeleteEvent 	= { this.onDeleteEvent }
										isUserSchoolWorker 	= { isUserSchoolWorker }
							/>
							<AddEventButton handleClick={this.handleClickAddEventButton}/>
						</div>
					</div>
				</div>
				{ this.renderDeleteEventPopupOpen() }
			</div>
		);
	}
});

module.exports = EventsCalendar;