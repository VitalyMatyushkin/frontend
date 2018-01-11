/**
 * Created by Anatoly on 10.10.2016.
 */

const	React				= require('react'),
		Morearty			= require('morearty'),
		{MonthYearSelector}	= require('module/ui/calendar/month_year_selector'),
		{MODE_FIXTURES}		= require('module/ui/fixtures/fixtures_helper'),
		Fixtures			= require('../../../../ui/fixtures/fixtures');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.initMonthDate();
	},
	initMonthDate: function() {
		this.getDefaultBinding().set(
			'monthDate',
			new Date()
		);
	},
	onClickChallenge: function (eventId, schoolId) {
		document.location.hash = 'event/' + eventId + "?schoolId=" + schoolId ;
	},
	onMonthClick: function (date) {
		const binding = this.getDefaultBinding();
		binding.set('monthDate', date);
	},
	render: function () {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding			= this.getDefaultBinding(),
				schoolId 		= activeSchoolId === 'all' ? '' : [activeSchoolId],
				schoolIdList 	= activeSchoolId === 'all' ? binding.toJS('schoolIds') : [activeSchoolId];

		return (
				<div className="bFixtures">
					<MonthYearSelector
						date 			= {binding.get('monthDate')}
						onMonthClick 	= {date => this.onMonthClick(date)}
					/>
					<Fixtures
						mode			= {MODE_FIXTURES.STUDENT}
						date			= {binding.get('monthDate')}
						activeSchoolId	= {activeSchoolId}
						onClick			= {this.onClickChallenge}
						schoolId		= {schoolId}
						schoolIdList	= {schoolIdList}
						school			= {binding.toJS('school')}
					/>
				</div>
		);
	}
});


module.exports = EventFixtures;
