/**
 * Created by Anatoly on 22.09.2016.
 */

const React = require('react');
const Morearty = require('morearty');

const {MonthYearSelector} = require('module/ui/calendar/month_year_selector');
// const {MODE_FIXTURES} = require('module/ui/fixtures/fixtures_helper');
const Fixtures = require('module/ui/fixtures/fixtures');

const FixturesStyles = require('./../../../../../styles/ui/bFixtures.scss');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding = this.getDefaultBinding(),
				bindingCalendar = this.getBinding('calendar'),
				currentDate = bindingCalendar.toJS('monthDate');

		binding.clear();
		this.activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
		binding.set('dateCalendar', currentDate);
	},
	onClickChallenge: function (eventId) {
		document.location.hash = 'event/' + eventId;
	},
	onMonthClick: function (date) {
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
					mode			= 'ADMIN'
					date			= {binding.get('dateCalendar')}
					activeSchoolId	= {activeSchoolId}
					onClick			= {this.onClickChallenge}
				/>
			</div>
		);
	}
});

module.exports = EventFixtures;