/**
 * Created by Anatoly on 22.09.2016.
 */

const   React           = require('react'),
        Morearty        = require('morearty'),
		Immutable       = require('immutable'),
		DateHelper 		= require('module/helpers/date_helper'),
		EventHelper     = require('module/helpers/eventHelper'),
		Loader 			= require('module/ui/loader'),
		FixtureTitle 	= require('./fixture_title'),
		FixtureList 	= require('./fixture_list');

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
		document.location.hash = 'event/' + eventId + '?tab=teams';
	},
    getFixtures: function () {
        const   self    		= this,
				activeSchoolId  = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
                binding 		= self.getDefaultBinding();

        let result = <div><br /><br /><Loader /></div>;

        if(binding.toJS('sync')) {
			result = (
				<FixtureList events={binding.toJS('models')} activeSchoolId={activeSchoolId} onClick={self.onClickChallenge} />
			);
        }

        return result;
    },
	render: function () {
        const   challenges = this.getFixtures();

		return (
			<div className="bChallenges">
				<FixtureTitle />
				{challenges}
			</div>
        );
	}
});


module.exports = EventFixtures;
