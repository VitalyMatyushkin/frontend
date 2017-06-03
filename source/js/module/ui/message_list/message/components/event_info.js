const	React			= require('react'),
		DateHelper		= require('module/helpers/date_helper'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const EventInfo = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	getAges: function (data) {
		data = data || [];
		return data
			.map(elem => elem === 0 ? 'Reception' : 'Y' + elem)
			.join(", ");
	},
	getGender: function (gender) { //TODO Move this method into helpers
		switch (gender) {
			case 'MALE_ONLY':
				return 'Boys';
			case 'FEMALE_ONLY':
				return 'Girls';
			case 'MIXED':
				return 'Mixed';
			default:
				return '';
		}
	},
	addZeroToFirst: function (num) {
		return String(num).length === 1 ? '0' + num : num;
	},
	render: function() {
		const message = this.props.message;

		const	sport				= message.event.sport.name,
				ages				= message.event.ages,
				gender				= message.event.gender,
				startTimeDataObject	= new Date(message.event.startTime),
				startDate			= DateHelper.getDateStringFromDateObject(startTimeDataObject),
				hours				= this.addZeroToFirst(startTimeDataObject.getHours()),
				minutes				= this.addZeroToFirst(startTimeDataObject.getMinutes());

		return (
			<div className="eInvite_content mMessage">
				{sport} / {this.getGender(gender)} / {this.getAges(ages)}<br/>
				{startDate} / {hours + ':' + minutes}<br/>
			</div>
		);
	}
});

module.exports = EventInfo;