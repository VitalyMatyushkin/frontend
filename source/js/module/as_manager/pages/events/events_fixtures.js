/**
 * Created by Anatoly on 22.09.2016.
 */

const   React           = require('react'),
        Morearty        = require('morearty'),
		Immutable       = require('immutable'),
		DateHelper 		= require('module/helpers/date_helper'),
		EventHelper     = require('module/helpers/eventHelper'),
		Fixtures 		= require('module/ui/fixtures/fixtures');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const   self            = this,
				binding         = self.getDefaultBinding();

		binding.clear();
		self.activeSchoolId = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		self._setEvents();
	},
	_setEvents: function() {
		const   self    = this,
				binding = self.getBinding('calendar');

		const currentDate = binding.toJS('monthDate');

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
	onClickChallenge: function (eventId) {
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},
	render: function () {
		const   self    		= this,
				activeSchoolId  = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding 		= self.getDefaultBinding();

		return (
			<div className="bFixtures">
				<Fixtures	events			= {binding.toJS('models')}
							activeSchoolId	= {activeSchoolId}
							sync			= {binding.toJS('sync')}
							onClick			= {self.onClickChallenge} />;
			</div>
		);
	}
});


module.exports = EventFixtures;
