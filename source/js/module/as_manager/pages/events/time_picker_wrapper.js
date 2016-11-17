const	React				= require('react'),
		Morearty			= require('morearty'),

		TimePicker			= require('./../../../ui/timepicker/timepicker');

const TimeInputWrapper = React.createClass({
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

		const timeString = binding.toJS();

		if(typeof timeString !== 'undefined' && timeString !== null) {
			const dateObject = new Date(timeString);
			return (
				<TimePicker	hourValue			= { dateObject.getHours() }
							minutesValue		= { dateObject.getMinutes() }
							handleChangeHour	= { this.handleChangeHour }
							handleChangeMinutes	= { this.handleChangeMinutes }
				/>
			);
		} else {
			return null;
		}
	}
});

module.exports = TimeInputWrapper;