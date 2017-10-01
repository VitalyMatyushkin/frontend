// Main components
const	React				= require('react'),
		Morearty			= require('morearty');

// EditEventForm React components
const	DateSelector		= require('../../../../../ui/date_selector/date_selector'),
		FullTimeInput		= require('../../../../../ui/full_time_input/full_time_input'),
		SaveChangesManager	= require('module/as_manager/pages/event/view/edit_event_popup/save_changes_manager'),
		EventVenue			= require('../../../events/manager/event_venue');

// Helpers
const	EventHelper			= require('../../../events/eventHelper');

// Styles
const	EventEditStyle		= require('../../../../../../../styles/ui/b_event_edit.scss'),
		InputWrapperStyle	= require('../../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyle		= require('../../../../../../../styles/ui/b_input_label.scss');

const EditEventForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getActiveSchoolInfo: function() {
		const schoolsData = this.getDefaultBinding().toJS('model.schoolsData');

		return schoolsData.find(school => school.id === this.props.activeSchoolId);
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
		const	self	= this,
				binding	= self.getDefaultBinding();

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
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<EventVenue
						binding					= {binding}
						eventType				= {
							EventHelper.serverEventTypeToClientEventTypeMapping[ binding.toJS('model.eventType') ]
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