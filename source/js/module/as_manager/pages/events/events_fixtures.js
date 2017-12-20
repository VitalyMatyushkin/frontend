/**
 * Created by Anatoly on 22.09.2016.
 */

const   React		= require('react'),
        Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	{ MonthYearSelector }	= require('module/ui/calendar/month_year_selector'),
		Fixtures				= require('module/ui/fixtures/fixtures');

const	{ DateHelper}	= require('module/helpers/date_helper'),
		EventHelper		= require('module/helpers/eventHelper');

const	FixturesStyles	= require('./../../../../../styles/ui/bFixtures.scss');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding = this.getDefaultBinding(),
				bindingCalendar = this.getBinding('calendar'),
				currentDate = bindingCalendar.toJS('monthDate');

		binding.clear();
		this.activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
		binding.set('dateCalendar', currentDate);
		this._setEvents();
	},
	_setEvents: function() {
		const 	binding = this.getDefaultBinding();
		this._setEventsByDateRange(
			DateHelper.getStartDateTimeOfMonth(binding.get('dateCalendar')),
			DateHelper.getEndDateTimeOfMonth(binding.get('dateCalendar'))
		);
	},
	_setEventsByDateRange: function(gteDate, ltDate) {
		const binding = this.getDefaultBinding();

		window.Server.events.get(this.activeSchoolId, {
				filter: {
					limit: 1000,
					where: {
						startTime: {
							'$gte': gteDate,// like this `2016-07-01T00:00:00.000Z`,
							'$lt':  ltDate// like this `2016-07-31T00:00:00.000Z`
						}
					}
				}
			})
			.then(events => events.filter(event => EventHelper.isShowEventOnCalendar(event, this.activeSchoolId)))
			.then(events => {
				binding
					.atomically()
					.set('models', Immutable.fromJS(events))
					.set('sync', true)
					.commit();
			});
	},
	onClickChallenge: function (eventId) {
		document.location.hash = 'event/' + eventId;
	},
	onMonthClick: function (date) {
		const binding = this.getDefaultBinding();

		binding.set('sync', false);
		binding.set('dateCalendar', date);

		this._setEvents();
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
				<Fixtures	events			= {binding.toJS('models')}
							activeSchoolId	= {activeSchoolId}
							sync			= {binding.toJS('sync')}
							onClick			= {this.onClickChallenge}
				/>
			</div>
		);
	}
});

module.exports = EventFixtures;