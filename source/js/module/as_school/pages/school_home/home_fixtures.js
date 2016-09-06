const	DateTimeMixin	= require('module/mixins/datetime'),
		React			= require('react'),
		Immutable		= require('immutable'),
		Morearty        = require('morearty'),
		EventHelper		= require('module/helpers/eventHelper'),
		FixtureItem		= require('./fixture_item'),
		FixtureList		= require('./fixture_list');

const HomeFixtures = React.createClass({
	mixins:[Morearty.Mixin,DateTimeMixin],
	componentWillMount: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		binding.set(
			'fixturesSync',
			Immutable.fromJS(
				false
			)
		);
		self._setFixturesByDate(
			binding.toJS('currentDate')
		);

		binding.sub('selectDay').addListener((descriptor) => {
			binding.set(
				'fixturesSync',
				Immutable.fromJS(
					false
				)
			);
			self._setFixturesByDate(
				descriptor.getCurrentValue().date
			);
		});
	},
	_setFixturesByDate: function(date) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		// TODO don't forget about filter
		//filter: {
		//	order: 'startTime ASC'
		//}
		window.Server.publicSchoolEvents.get({schoolId: activeSchoolId}, {filter: {limit: 100}}).then((events) => {
				const filteredEvents = events.filter((event) => {
					const	eventDate	= new Date(event.startTime).toLocaleDateString(),
							currentDate	= date.toLocaleDateString();

					return currentDate == eventDate && EventHelper.isShowEventOnPublicSchoolCalendar(event);
				});

				return Promise.all(filteredEvents.map(event => {
					return self._getEventTeams(event);
				}));
			})
			.then(events => {
				return Promise.all(events.map(event => {
					return window.Server.sport.get(event.sportId).then(sport => {
						event.sport = sport;

						return event;
					});
				}));
			})
			.then(events => {
				binding
					.atomically()
					.set('fixtures',Immutable.fromJS(events))
					.set('fixturesSync',Immutable.fromJS(true))
					.commit();
			});
	},
	_getEventTeams: function(event) {
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		return window.Server.publicSchoolEventTeams.get({
				schoolId:	activeSchoolId,
				eventId:	event.id
			})
			.then(teams => {
				return Promise.all(teams.map(team => {
					if(team.houseId) {
						return window.Server.publicSchoolHouse.get(
							{
								schoolId:   activeSchoolId,
								houseId:    team.houseId
							}
						).then(house => {
							team.house = house;

							return self._getSchoolForTeam(team);
						});
					} else {
						return self._getSchoolForTeam(team);
					}
				}))
				.then(teams => {
					event.participants = teams;

					return event;
				});
			});
	},
	_getSchoolForTeam: function(team) {
		return window.Server.publicSchool.get(team.schoolId)
			.then(school => {
				team.school = school;

				return team;
			});
	},
	render:function() {
		const 	activeSchoolId 	= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				binding 		= this.getDefaultBinding(),
				events 			= binding.toJS('fixtures'),
				selectDay 		= binding.get('selectDay'),
				isDaySelected 	= typeof selectDay !== 'undefined' && selectDay !== null,
				isSync 			= binding.toJS('fixturesSync');

		return <FixtureList
			activeSchoolId={activeSchoolId}
			isDaySelected={isDaySelected}
			isSync={isSync}
			events={events}
		/>;
	}
});
module.exports = HomeFixtures;