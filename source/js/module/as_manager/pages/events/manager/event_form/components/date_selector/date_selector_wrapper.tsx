import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as DateSelector from '../../../../../../../ui/date_selector/date_selector';
import '../../../../../../../../../styles/ui/b_date_selector_wrapper.scss';

export const DateSelectorWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],

	handleChangeDate: function(date: Date): void {
		this.getDefaultBinding().set(Immutable.fromJS(date));
	},

	render: function() {
		const date = String(this.getDefaultBinding().toJS());

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