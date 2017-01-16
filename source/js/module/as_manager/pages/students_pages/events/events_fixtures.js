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
		const   binding         = this.getDefaultBinding();

		this._setEvents();
	},
	componentDidMount: function () {
		const 	binding = this.getDefaultBinding();

		/** Loading initial data for this month */
		this.addBindingListener(binding, 'school', this.setEvents);
		this.addBindingListener(binding, 'activeSchoolId', this.setEvents);
	},
	setEvents: function() {
		const   binding = this.getDefaultBinding().sub('calendar');

		const currentDate = binding.toJS('monthDate');

		this.setEventsByDateRange(
			DateHelper.getStartDateTimeOfMonth(currentDate),
			DateHelper.getEndDateTimeOfMonth(currentDate)
		);
	},
	setEventsByDateRange: function(gteDate, ltDate) {
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId 	= binding.toJS('activeSchoolId'),
				schoolIdList 	= activeSchoolId === 'all' ? binding.toJS('schoolIds') : [activeSchoolId];

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
				schoolIdList: schoolIdList
			}
		};

		binding.set('sync', false);
		if(schoolIdList.length)
			window.Server.schoolEvents.get({ filter: filter })
				.then(events => {
					this.injectSchoolToEvents(events, binding.toJS('school'), schoolIdList);
					binding
						.atomically()
						.set('models', Immutable.fromJS(events))
						.set('sync', true)
						.commit();
				});
	},
	injectSchoolToEvents: function(events, schoolList, currentSchoolIdList) {
		if(currentSchoolIdList.length === 1) {
			return this.injectSchoolsToEvents(events, schoolList.find(sch => sch.id === currentSchoolIdList[0]));
		} else {
			return events.forEach(event => {
				const school = this.getSchoolFromEvent(event, schoolList);
				if(typeof school !== "undefined") {
					event.school = school;
				}
			});
		}
	},
	getSchoolFromEvent: function(event, schoolList) {
		return schoolList.find(school => this.isSchoolPlayInEvent(event, school));
	},
	isSchoolPlayInEvent: function(event, school) {
		const foundTeam = event.teamsData.find(t => this.isSchoolPlayInTeam(t, school));

		return typeof foundTeam !== 'undefined';
	},
	isSchoolPlayInTeam: function(team, school) {
		const foundPlayer = team.players.find(p => p.userId === school.id);

		return typeof foundPlayer !== 'undefined';
	},
	injectSchoolsToEvents: function(events, school) {
		return events.forEach(e => e.school = school);
	},
	onClickChallenge: function (eventId, schoolId) {
		document.location.hash = 'event/' + eventId + "?schoolId=" + schoolId ;
	},

	render: function () {
		const	activeSchoolId	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				binding			= this.getDefaultBinding();

		return (
				<Fixtures	events			= {binding.toJS('models')}
							sync			= {binding.toJS('sync')}
							onClick			= {this.onClickChallenge}
				/>
		);
	}
});


module.exports = EventFixtures;
