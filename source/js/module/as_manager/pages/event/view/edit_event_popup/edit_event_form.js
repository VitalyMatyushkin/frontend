const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	DateSelector		= require('./../../../events/manager/manager_components/date_selector/date_selector'),
		FullTimeInput		= require('./../../../../../ui/full_time_input/full_time_input'),
		EventVenue			= require('../../../events/manager/event_venue');

const	EventHelper			= require('../../../events/eventHelper'),
		SchoolHelper		= require('../../../../../helpers/school_helper');

const	EventEditStyle		= require('../../../../../../../styles/ui/b_event_edit.scss'),
		InputWrapperStyle	= require('../../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyle		= require('../../../../../../../styles/ui/b_input_label.scss');

const EditEventForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId	: React.PropTypes.string.isRequired
	},
	getActiveSchoolInfo: function() {
		const schoolsData = this.getDefaultBinding().toJS('model.schoolsData');

		return schoolsData.find(school => school.id === SchoolHelper.getActiveSchoolId(this));
	},
	getOpponentSchoolInfo: function() {
		const schoolsData = this.getDefaultBinding().toJS('model.schoolsData');

		return schoolsData.find(school => school.id !== SchoolHelper.getActiveSchoolId(this));
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
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	date		= binding.toJS('model.startTime'),
				dateObject	= new Date(date);

		return (
			<div className="bEventEdit">
				Edit event
				<div className="bInputWrapper mZeroHorizontalMargin">
					<div className="bInputLabel">
						Date
					</div>
					<DateSelector	date				= {date}
									handleChangeDate	= {this.handleChangeDate}
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin">
					<div className="bInputLabel">
						Time
					</div>
					<FullTimeInput	hourValue			= {dateObject.getHours()}
									minutesValue		= {dateObject.getMinutes()}
									handleChangeHour	= {this.handleChangeHour}
									handleChangeMinutes	= {this.handleChangeMinutes}
					/>
				</div>
				<div className="bInputWrapper mZeroHorizontalMargin">
					<EventVenue	binding				= {binding}
								eventType			= {EventHelper.serverEventTypeToClientEventTypeMapping[binding.toJS('model.eventType')]}
								activeSchoolInfo	= {this.getActiveSchoolInfo()}
								opponentSchoolInfo	= {this.getOpponentSchoolInfo()}
					/>
				</div>
			</div>
		);
	}
});

module.exports = EditEventForm;