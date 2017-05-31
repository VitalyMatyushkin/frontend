const	React			= require('react'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const EventInfo = React.createClass({
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
	render: function() {
		return (
			<div className="eInvite_content">
				{sport} / {this.getGender(gender)} / {this.getAges(ages)} <br/>
				{startDate} / {hours + ':' + minutes}<br/>
			</div>
		);
	}
});

module.exports = EventInfo;