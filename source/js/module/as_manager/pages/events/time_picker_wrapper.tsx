import * as	React from 'react';
import * as	Morearty from 'morearty';

import * as	TimePicker from './../../../ui/timepicker/timepicker';

export const TimeInputWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],

	handleChangeHour: function(hour: number): void {
		const	binding		= this.getDefaultBinding(),
			timeString  = binding.toJS(),
			dateObject  = new Date(timeString);

		dateObject.setHours(hour);
		binding.set(dateObject.toISOString());
	},
	handleChangeMinutes: function(minute: number): void {
		const	binding     = this.getDefaultBinding(),
			timeString  = binding.toJS(),
			dateObject  = new Date(timeString);

		dateObject.setMinutes(minute);

		binding.set(dateObject.toISOString());
	},
	render: function() {
		const   binding     = this.getDefaultBinding(),
			timeString  = binding.toJS();

		if(typeof timeString !== 'undefined' && timeString !== null) {
			const dateObject = new Date(timeString);
			return (
				<TimePicker
					hourValue			= { dateObject.getHours() }
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