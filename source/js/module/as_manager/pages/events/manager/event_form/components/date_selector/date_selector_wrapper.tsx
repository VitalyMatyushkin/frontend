import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as DateSelector from '../../../../../../../ui/date_selector/date_selector';
import '../../../../../../../../../styles/ui/b_date_selector_wrapper.scss';

export const DateSelectorWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	//set end time, when change date
	//because otherwise end time change, but not end date
	handleChangeDate: function(date: Date): void {
		const 	binding 	= this.getDefaultBinding(),
				end 		= binding.toJS('endTime'),
				newDate 	= new Date(date),
				endNewDate 	= new Date(end),
				day 		= newDate.getDate(),
				month 		= newDate.getMonth(),
				year 		= newDate.getFullYear();

		endNewDate.setDate(day);
		endNewDate.setMonth(month);
		endNewDate.setFullYear(year);

		binding.atomically()
			.set('startTime', 	Immutable.fromJS(date))
			.set('endTime', 	Immutable.fromJS(endNewDate.toISOString()))
			.commit();
	},

	render: function() {
		const date = String(this.getDefaultBinding().toJS('startTime'));

		return(
			<div className="bDateSelectorWrapper">
				<DateSelector
					date				= { date }
					handleChangeDate	= { this.handleChangeDate }
				/>
			</div>
		);
	}
});