/**
 * Created by Anatoly on 10.10.2016.
 */

const   React           = require('react'),
        Morearty        = require('morearty'),
		Immutable       = require('immutable'),
		DateHelper 		= require('module/helpers/date_helper'),
		Fixtures 		= require('module/ui/fixtures/fixtures');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const   self            = this,
				binding         = self.getDefaultBinding();

		self._setEvents();
	},
	componentDidMount: function () {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		/** Loading initial data for this month */
		self.addBindingListener(binding, 'children', self._setEvents);
		self.addBindingListener(binding, 'activeChildId', self._setEvents);
	},
	_setEvents: function() {
		const   self    = this,
				binding = self.getDefaultBinding().sub('calendar');

		const currentDate = binding.toJS('monthDate');

		self._setEventsByDateRange(
			DateHelper.getStartDateTimeOfMonth(currentDate),
			DateHelper.getEndDateTimeOfMonth(currentDate)
		);
	},
	_setEventsByDateRange: function(gteDate, ltDate) {
		const 	binding 		= this.getDefaultBinding(),
				activeChildId 	= binding.toJS('activeChildId'),
				childIdList 	= activeChildId === 'all' ? binding.toJS('childrenIds') : [activeChildId];

		const filter = {
			limit: 1000,
			where: {
				startTime: {
					$gte: 	gteDate,
					$lt: 	ltDate
				},
				status: {
					$in: ['ACCEPTED', 'FINISHED']
				},
				childIdList: childIdList
			}
		};

		binding.set('sync', false);
		if(childIdList.length)
			window.Server.childrenEvents.get({ filter: filter })
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
	render: function () {
		const   self    		= this,
				activeSchoolId  = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding 		= self.getDefaultBinding();

		return <Fixtures events={binding.toJS('models')}
						 activeSchoolId={activeSchoolId}
						 sync={binding.toJS('sync')}
						 onClick={self.onClickChallenge} />;
	}
});


module.exports = EventFixtures;
