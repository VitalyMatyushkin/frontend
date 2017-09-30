// Main components
const	React				= require('react'),
		Morearty			= require('morearty');

// EditEventForm React components
const	DateSelector		= require('../../../../../ui/date_selector/date_selector'),
		FullTimeInput		= require('../../../../../ui/full_time_input/full_time_input'),
		SaveChangesManager	= require('module/as_manager/pages/event/view/edit_event_popup/save_changes_manager'),
		EventVenue			= require('../../../events/manager/event_venue');

// Helpers
const	EventHelper			= require('../../../events/eventHelper'),
		SchoolHelper		= require('../../../../../helpers/school_helper');

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
	handleChangeDate: function(date) {
		this.getDefaultBinding().set('model.startTime', date);
	},
	handleChangeHour: function(hour) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('model.startTime'),
				dateObject = new Date(timeString);

		dateObject.setHours(hour);

		binding.set('model.startTime', dateObject.toISOString());
	},
	handleChangeMinutes: function(minute) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('model.startTime'),
				dateObject = new Date(timeString);

		dateObject.setMinutes(minute);

		binding.set('model.startTime', dateObject.toISOString());
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

		const	date		= binding.toJS('model.startTime'),
				dateObject	= new Date(date);

		return (
			<div className="bEventEdit">
				Edit event
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<div className="bInputLabel">
						Date
					</div>
					<DateSelector	date				= {date}
									handleChangeDate	= {this.handleChangeDate}
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<div className="bInputLabel">
						Time
					</div>
					<FullTimeInput	hourValue			= {dateObject.getHours()}
									minutesValue		= {dateObject.getMinutes()}
									handleChangeHour	= {this.handleChangeHour}
									handleChangeMinutes	= {this.handleChangeMinutes}
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin mSmallWide">
					<EventVenue	binding					= {binding}
								eventType				= {EventHelper.serverEventTypeToClientEventTypeMapping[binding.toJS('model.eventType')]}
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