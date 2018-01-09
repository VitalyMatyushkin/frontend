/**
 * Created by Anatoly on 10.10.2016.
 */

const	React		= require('react'),
		Morearty	= require('morearty');

const	{ MonthYearSelector }	= require('module/ui/calendar/month_year_selector'),
		Fixtures				= require('../../../../ui/fixtures/fixtures');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const binding = this.getDefaultBinding();
        this.activeChildId = binding.toJS('activeChildId');
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
				activeChildId 	= binding.toJS('activeChildId'),
				childIdList 	= activeChildId === 'all' ? binding.toJS('childrenIds') : [activeChildId];

        if(this.activeChildId !== binding.toJS('activeChildId')){
            this.initMonthDate();
            this.activeChildId = binding.toJS('activeChildId');
        }

		return (
				<div className="bFixtures">
					<MonthYearSelector
						date			= { binding.get('monthDate') }
						onMonthClick	= { date => this.onMonthClick(date) }
					/>
					<Fixtures
						date			= {binding.get('monthDate')}
						activeSchoolId	= {activeSchoolId}
						onClick			= {this.onClickChallenge}
						children		= {binding.toJS('children')}
						childIdList		= {childIdList}
					/>
				</div>
		);
	}
});


module.exports = EventFixtures;
