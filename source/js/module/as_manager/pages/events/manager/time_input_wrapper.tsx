import * as React from 'react';
import * as Morearty from 'morearty';

import * as FullTimeInput from './../../../../ui/full_time_input/full_time_input';

export const TimeInputWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],

	handleChangeHour: function(hour: number): void {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS(),
			dateObject = new Date(timeString);

		dateObject.setHours(hour);

		binding.set(dateObject.toISOString());
	},
	handleChangeMinutes: function(minute: number): void {
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
			<FullTimeInput
				hourValue			= { dateObject.getHours() }
				minutesValue		= { dateObject.getMinutes() }
				handleChangeHour	= { this.handleChangeHour }
				handleChangeMinutes	= { this.handleChangeMinutes }
			/>
		);
	}
});