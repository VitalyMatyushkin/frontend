/**
 * Created by Anatoly on 10.10.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		DateHelper		= require('../../../../helpers/date_helper'),
		Fixtures		= require('../../../../ui/fixtures/fixtures');

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
					this.injectChildrenToEvents(events, binding.toJS('children'), childIdList);
					binding
						.atomically()
						.set('models', Immutable.fromJS(events))
						.set('sync', true)
						.commit();
				});
	},
	injectChildrenToEvents: function(events, childList, currentChildIdList) {
		if(currentChildIdList.length === 1) {
			return this.injectChildToEvents(events, childList.find(c => c.id === currentChildIdList[0]));
		} else {
			return events.forEach(event => {
				const child = this.getChildFromEvent(event, childList);
				if(typeof child !== "undefined") {
					event.child = child;
				}
			});
		}
	},
	getChildFromEvent: function(event, childList) {
		return childList.find(child => this.isChildPlayInEvent(event, child));
	},
	isChildPlayInEvent: function(event, child) {
		const foundTeam = event.teamsData.find(t => this.isChildPlayInTeam(t, child));

		return typeof foundTeam !== 'undefined';
	},
	isChildPlayInTeam: function(team, child) {
		const foundPlayer = team.players.find(p => p.userId === child.id);

		return typeof foundPlayer !== 'undefined';
	},
	injectChildToEvents: function(events, child) {
		return events.forEach(e => e.child = child);
	},
	onClickChallenge: function (eventId, schoolId) {
		document.location.hash = 'event/' + eventId + "?schoolId=" + schoolId ;
	},
	render: function () {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding			= this.getDefaultBinding();

		return (
				<Fixtures	events			= { binding.toJS('models') }
							sync			= { binding.toJS('sync') }
							onClick			= { this.onClickChallenge }
							activeSchoolId 	= { activeSchoolId }
				/>
		);
	}
});


module.exports = EventFixtures;
