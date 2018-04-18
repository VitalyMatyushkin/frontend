/**
 * Created by Anatoly on 22.09.2016.
 */

import * as	React from 'react';
import * as	Morearty from 'morearty';

import {MonthYearSelector} from 'module/ui/calendar/month_year_selector';
import {MODE_FIXTURES} from 'module/ui/fixtures/fixtures_helper';
import * as	 Fixtures from 'module/ui/fixtures/fixtures';
import {RegionHelper} from 'module/helpers/region_helper'


import './../../../../../styles/ui/bFixtures.scss';

export const EventFixtures = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function () {
		const 	binding = this.getDefaultBinding(),
				bindingCalendar = this.getBinding('calendar'),
				currentDate = bindingCalendar.toJS('monthDate');

		binding.clear();
		this.activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
		binding.set('dateCalendar', currentDate);
	},

	onClickChallenge: function (eventId: string): void {
		document.location.hash = 'event/' + eventId;
	},

	onMonthClick: function (date: string): void {
		const binding = this.getDefaultBinding();
		binding.set('dateCalendar', date);
	},

	render: function () {
		const 	activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding			= this.getDefaultBinding();

		return (
			<div className="bFixtures">
				<MonthYearSelector
					date			= { binding.get('dateCalendar') }
					onMonthClick	= { date => this.onMonthClick(date) }
				/>
				<Fixtures
					mode			= { MODE_FIXTURES.ADMIN }
					date			= { binding.get('dateCalendar') }
					activeSchoolId	= { activeSchoolId }
					onClick			= { (eventId) => this.onClickChallenge(eventId) }
					region			= {RegionHelper.getRegion(this.getMoreartyContext().getBinding())}
				/>
			</div>
		);
	}
});