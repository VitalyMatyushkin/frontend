const	ChallengesList	= require('module/ui/challenges/challenges_list'),
		CalendarView	= require('module/ui/calendar/calendar'),
		Morearty		= require('morearty'),
		Immutable       = require('immutable'),
		EventHelper     = require('module/helpers/eventHelper'),
		DateHelper      = require('module/helpers/date_helper'),
		React			= require('react');

const EventsCalendar = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const self = this;

		self.activeSchoolId = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		// set data
		self._setEvents();

		// add listeners
		self._addListeners();
	},
	_addListeners: function() {
		const   self    = this,
			binding = self.getDefaultBinding();

		// Listen changes of date in calendar
		binding.addListener('calendar.currentMonth', () => {
			const currentDate = binding.toJS('calendar.currentDate');

			self._setEventsByDateRange(
				DateHelper.getStartDateTimeOfMonth(currentDate),
				DateHelper.getEndDateTimeOfMonth(currentDate)
			);
		});
	},
	_setEvents: function() {
		const   self    = this,
			binding = self.getDefaultBinding();

		const currentDate = binding.toJS('calendar.currentDate');

		self._setEventsByDateRange(
			DateHelper.getStartDateTimeOfMonth(currentDate),
			DateHelper.getEndDateTimeOfMonth(currentDate)
		);
	},
	_setEventsByDateRange: function(gteDate, ltDate) {
		const   self            = this,
			binding         = self.getDefaultBinding();

		window.Server.events.get(self.activeSchoolId, {
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
			.then(events => events.filter(event => EventHelper.isShowEventOnCalendar(event, self.activeSchoolId)))
			.then(events => {
				binding
					.atomically()
					.set('models', Immutable.fromJS(events))
					.set('sync', true)
					.commit();
			});
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div className="eEvents_calendar">
				<CalendarView binding={binding.sub('calendar')} />
				<ChallengesList binding={binding} />
			</div>
		);
	}
});

module.exports = EventsCalendar;