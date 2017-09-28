/**
 * Created by Anatoly on 10.10.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		DateHelper		= require('../../../../helpers/date_helper'),
		MonthNavBar		= require('module/ui/calendar/month_year_selector'),
		Fixtures		= require('../../../../ui/fixtures/fixtures');

const EventFixtures = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.initMonthDate();
		this.setEvents();
	},
	componentDidMount: function () {
		const binding = this.getDefaultBinding();

		/** Loading initial data for this month */
		this.addBindingListener(binding, 'children', this.setEvents);
		this.addBindingListener(binding, 'activeChildId', this.setEvents);
	},
	initMonthDate: function() {
		this.getDefaultBinding().set(
			'monthDate',
			new Date()
		);
	},
	setEvents: function() {
		const 	binding = this.getDefaultBinding(),
				currentDate = binding.get('monthDate');

		this.setEventsByDateRange(
			DateHelper.getStartDateTimeOfMonth(currentDate),
			DateHelper.getEndDateTimeOfMonth(currentDate)
		);
	},
	setEventsByDateRange: function(gteDate, ltDate) {
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
	onMonthClick: function (date) {
		const binding = this.getDefaultBinding();

		binding.set('sync', false);
		binding.set('monthDate', date);

		this.setEvents();
	},
	render: function () {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding			= this.getDefaultBinding();

		return (
				<div className="bFixtures">
					<MonthNavBar
						date 			= {binding.get('monthDate')}
						onMonthClick 	= {date => this.onMonthClick(date)}
					/>
					<Fixtures
						events			= { binding.toJS('models') }
						sync			= { binding.toJS('sync') }
						onClick			= { this.onClickChallenge }
						activeSchoolId 	= { activeSchoolId }
					/>
				</div>
		);
	}
});


module.exports = EventFixtures;
