const	React			= require('react'),
		Morearty		= require('morearty'),

		FullTimeInput	= require('./../../../../ui/full_time_input/full_time_input');

const EventManager = React.createClass({
	mixins: [Morearty.Mixin],

	handleChangeHour: function(hour) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS(),
				dateObject = new Date(timeString);

		dateObject.setHours(hour);

		binding.set(dateObject.toISOString());
	},
	handleChangeMinutes: function(minute) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS(),
				dateObject = new Date(timeString);

		dateObject.setMinutes(minute);

		binding.set(dateObject.toISOString());
	},
	render: function() {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS(),
				dateObject = new Date(timeString);

		return (
			<FullTimeInput	hourValue			= { dateObject.getHours() }
							minutesValue		= { dateObject.getMinutes() }
							handleChangeHour	= { this.handleChangeHour }
							handleChangeMinutes	= { this.handleChangeMinutes }
			/>
		);
	}
});

module.exports = EventManager;