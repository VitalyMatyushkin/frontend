// Main components
const	React				= require('react'),
		Morearty			= require('morearty');

// EditEventForm React components
const	DateSelector		= require('../../../../../ui/date_selector/date_selector'),
		FullTimeInput		= require('../../../../../ui/full_time_input/full_time_input'),
		SaveChangesManager	= require('module/as_manager/pages/event/view/edit_event_popup/save_changes_manager'),
		{AgeMultiselectDropdownWrapper} = require('module/as_manager/pages/events/manager/event_form/components/age_multiselect_dropdown/age_multiselect_dropdown_wrapper'),
		{EventVenue}		= require('../../../events/manager/event_venue');

// Helpers
const	{LocalEventHelper}  = require('module/as_manager/pages/events/eventHelper');
const	EventFormConsts		= require('module/as_manager/pages/events/manager/event_form/consts/consts');

// Styles
const	EventEditStyle		= require('../../../../../../../styles/ui/b_event_edit.scss'),
		InputWrapperStyle	= require('../../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyle		= require('../../../../../../../styles/ui/b_input_label.scss');

const EditEventForm = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	propTypes: {
		activeSchoolId:		React.PropTypes.string.isRequired,
		activeSchool:	React.PropTypes.object.isRequired,
		schoolType:			React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		this.addListeners();
	},
	componentWillUnmount: function () {
		const binding	= this.getDefaultBinding();
		
		this.listeners.forEach(l => binding.removeListener(l));
		binding.clear();
	},
	addListeners: function() {
		this.addListenersForEventTimeAndSetDefaultValue();
	},
	//end time must be greater then start time always (this restriction was add to server 19-04-2018)
	//if not, add error style in component TimeInputWrapper
	addListenersForEventTimeAndSetDefaultValue: function(): void{
		const binding = this.getDefaultBinding();
		binding.set('model.isTimesValid', true);
		this.listeners.push(binding.sub('model.startTime').addListener( eventDescriptor =>
			{
				const currentValue = eventDescriptor.getCurrentValue();
				const 	startTime 		= new Date(currentValue),
						startTimeHours 	= startTime.getHours(),
						endTime 		= new Date(binding.sub('model.endTime').toJS()),
						endTimeHours 	= endTime.getHours();

				switch(true){
					case(startTimeHours >= endTimeHours && startTimeHours !== 23):
						const endTime = new Date(currentValue);
						endTime.setHours(endTime.getHours() + 1);
						binding.set('model.endTime', endTime.toISOString());
						break;
					case(startTimeHours >= endTimeHours && startTimeHours === 23):
						binding.set('model.isTimesValid', false);
						break;
					default:
						binding.set('model.isTimesValid', true);
						break;
				}
			}
		));
		this.listeners.push(binding.sub('model.endTime').addListener(eventDescriptor =>
			{
				const currentValue = eventDescriptor.getCurrentValue();
				const 	startTime 		= new Date(binding.sub('model.startTime').toJS()),
						startTimeHours 	= startTime.getHours(),
						endTime 		= new Date(currentValue),
						endTimeHours 	= endTime.getHours();
				
				switch(true){
					case(endTimeHours <= startTimeHours && endTimeHours !== 0):
						const startTime = new Date(currentValue);
						startTime.setHours(startTime.getHours() - 1);
						binding.set('model.startTime', startTime.toISOString());
						break;
					case(endTimeHours <= startTimeHours && endTimeHours === 0):
						binding.set('model.isTimesValid', false);
						break;
					default:
						binding.set('model.isTimesValid', true);
						break;
				}
			}
		));
	},
	getActiveSchoolInfo: function() {
		switch (this.props.schoolType) {
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL: {
				const schoolsData = this.getDefaultBinding().toJS('model.schoolsData');

				return schoolsData.find(school => school.id === this.props.activeSchoolId);
			}
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION: {
				return this.props.activeSchool;
			}
		}
	},
	getOpponentSchoolInfoArray: function() {
		const invitedSchools = this.getDefaultBinding()
			.toJS('model.schoolsData')
			.filter(s => s.id !== this.props.activeSchoolId);

		return invitedSchools.length !== 0 ? invitedSchools : undefined;
	},
	getStartDate: function () {
		return this.getDefaultBinding().toJS('model.startTime');
	},
	getStartDateObject: function () {
		return new Date(this.getStartDate());
	},
	getStartTimeHours: function () {
		return this.getStartDateObject().getHours();
	},
	getStartTimeMinutes: function () {
		return this.getStartDateObject().getMinutes();
	},
	getFinishDate: function () {
		return this.getDefaultBinding().toJS('model.endTime');
	},
	getFinishDateObject: function () {
		return new Date( this.getFinishDate() );
	},
	getFinishTimeHours: function () {
		return this.getFinishDateObject().getHours();
	},
	getFinishTimeMinutes: function () {
		return this.getFinishDateObject().getMinutes();
	},
	handleChangeDate: function(date) {
		this.getDefaultBinding().set('model.startTime', date);
	},
	handleChangeStartTimeHour: function(hour) {
		const binding = this.getDefaultBinding();

		const startDateObject = this.getStartDateObject();
		startDateObject.setHours(hour);

		binding.set('model.startTime', startDateObject.toISOString());
	},
	handleChangeStartTimeMinutes: function(minute) {
		const binding = this.getDefaultBinding();

		const startDateObject = this.getStartDateObject();
		startDateObject.setMinutes(minute);

		binding.set('model.startTime', startDateObject.toISOString());
	},
	handleChangeFinishTimeHour: function(hour) {
		const binding = this.getDefaultBinding();

		const finishDateObject = this.getFinishDateObject();
		finishDateObject.setHours(hour);

		binding.set('model.endTime', finishDateObject.toISOString());
	},
	handleChangeFinishTimeMinutes: function(hour) {
		const binding = this.getDefaultBinding();

		const finishDateObject = this.getFinishDateObject();
		finishDateObject.setMinutes(hour);

		binding.set('model.endTime', finishDateObject.toISOString());
	},
	renderSaveChangesManager: function () {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isShowChangesManager')) {
			return (
				<SaveChangesManager
					binding = { this.getDefaultBinding() }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				cssClassName 	= Boolean(binding.toJS('model.isTimesValid')) ? '' : 'mError';

		return (
			<div className="bEventEdit">
				Edit event
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<div className="bInputLabel">
						Date
					</div>
					<DateSelector
						date				= { this.getStartDate() }
						handleChangeDate	= { this.handleChangeDate }
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<div className="bInputLabel">
						Start Time
					</div>
					<FullTimeInput
						hourValue			= { this.getStartTimeHours() }
						minutesValue		= { this.getStartTimeMinutes() }
						handleChangeHour	= { this.handleChangeStartTimeHour }
						handleChangeMinutes	= { this.handleChangeStartTimeMinutes }
						cssClassName 		= { cssClassName }
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<div className="bInputLabel">
						Finish Time
					</div>
					<FullTimeInput
						hourValue			= { this.getFinishTimeHours() }
						minutesValue		= { this.getFinishTimeMinutes() }
						handleChangeHour	= { this.handleChangeFinishTimeHour }
						handleChangeMinutes	= { this.handleChangeFinishTimeMinutes }
						cssClassName 		= { cssClassName }
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<div className="bInputLabel">
						Ages
					</div>
					<AgeMultiselectDropdownWrapper binding={ this.getDefaultBinding() }/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<EventVenue
						binding					= {binding}
						eventType				= {
							LocalEventHelper.serverEventTypeToClientEventTypeMapping[ binding.toJS('model.eventType') ]
						}
						activeSchoolInfo		= {this.getActiveSchoolInfo()}
						opponentSchoolInfoArray	= {this.getOpponentSchoolInfoArray()}
					/>
				</div>
				{ this.renderSaveChangesManager() }
			</div>
		);
	}
});

module.exports = EditEventForm;