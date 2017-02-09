const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable');

const	ConfirmPopup		= require('./../../../../ui/confirm_popup'),
		DateSelector		= require('./../../events/manager/manager_components/date_selector/date_selector'),
		FullTimeInput		= require('./../../../../ui/full_time_input/full_time_input'),
		EventVenue			= require('../../events/manager/event_venue'),
		classNames			= require('classnames');

const	EventHelper			= require('../../events/eventHelper'),
		SchoolHelper		= require('../../../../helpers/school_helper');

const	EventEditStyle		= require('../../../../../../styles/ui/b_event_edit.scss'),
		InputWrapperStyle	= require('../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyle		= require('../../../../../../styles/ui/b_input_label.scss');

const EditEventPopup = React.createClass({
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
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	date		= binding.toJS('model.startTime'),
				dateObject	= new Date(date);

		console.log(binding.toJS());

		return (
			<ConfirmPopup	okButtonText			= "Save"
							cancelButtonText		= "Cancel"
							isOkButtonDisabled		= {false}
							handleClickOkButton		= {() => {}}
							handleClickCancelButton	= {() => {}}
							customStyle				= 'mBig'
			>
				<div className="bEventEdit">
					Edit event
					<div className="bInputWrapper mZeroHorizontalMargin">
						<div className="bInputLabel">
							Date
						</div>
						<DateSelector	date				= {date}
										handleChangeDate	= {() => {}}
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
			</ConfirmPopup>
		);
	}
});

module.exports = EditEventPopup;