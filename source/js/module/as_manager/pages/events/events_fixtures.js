/**
 * Created by Anatoly on 22.09.2016.
 */

const   React			= require('react'),
        Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		DateHelper 		= require('module/helpers/date_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		Fixtures 		= require('module/ui/fixtures/fixtures'),

		FixturesStyles	= require('./../../../../../styles/ui/bFixtures.scss');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		binding.clear();
		this.activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		this._setEvents();
	},
	_setEvents: function() {
		const binding = this.getBinding('calendar'),
			currentDate = binding.toJS('monthDate');

		this._setEventsByDateRange(
			DateHelper.getStartDateTimeOfMonth(currentDate),
			DateHelper.getEndDateTimeOfMonth(currentDate)
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
	render: function () {
		const activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding			= this.getDefaultBinding();

		return (
			<div className="bFixtures">
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