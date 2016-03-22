const	CalendarView	= require('module/ui/calendar/calendar'),
		React			= require('react'),
		Immutable		= require('immutable'),
		DateTimeMixin	= require('module/mixins/datetime'),
		Sport			= require('module/ui/icons/sport_icon'),
		Superuser		= require('module/helpers/superuser');

const HomeCalender = React.createClass({
	mixins:[Morearty.Mixin,DateTimeMixin],
	componentWillMount:function(){
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		Superuser.runAsSuperUser(rootBinding, () => {
			return window.Server.eventsBySchoolId.get({schoolId:activeSchoolId}).then((events) => {
				rootBinding.set('events.models',Immutable.fromJS(events));
			});
		});
	},
	getTeamName: function(team, type){
		const	self	= this;
		let		name	= 'n/a';

		if (team !== undefined) {
			switch(type) {
				case 'inter-schools':
					if(self.getMoreartyContext().getBinding().get('activeSchoolId') == team.school.id) {
						name = team.name;
					} else {
						name = team.school.name;
					}
					break;
				case 'houses':
					name = team.house.name;
					break;
				case 'internal':
					name = team.name;
					break;
			}
		}

		return name;
	},
	getSportIcon: function(sport) {
		const	name	= sport ? sport.name : '';

		return <Sport name={name} className="calendar_mSport" ></Sport>;
	},
	getCalenderFixtureLists: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				fixtureList	= binding.get('fixtures'),
				selectDay	= binding.get('selectDay');
		let		result;

		if(selectDay === undefined || selectDay === null) {
			result = (
				<div className="bFixtureMessage">
					{"Please select day."}
				</div>
			);
		} else if(binding.toJS('fixturesSync')) {
			if(fixtureList !== undefined && fixtureList.size != 0) {
				const	fixtures = fixtureList.toJS();

				result = fixtures.map(function(fixture){
					const	firstTeamName	= self.getTeamName(fixture.participants[0], fixture.type),
							secondTeamName	= self.getTeamName(fixture.participants[1], fixture.type);

					return (
						<div key={fixture.id} className="eSchoolFixtureListItem">
							<span className="eSchoolCalenderFixtureItem">{self.getSportIcon(fixture.sport)}</span>
							<span className="eSchoolCalenderFixtureItem">{self.getDateFromIso(fixture.startTime)}</span>
							<span className="eSchoolCalenderFixtureItem">{`${firstTeamName} vs ${secondTeamName}`}</span>
							<span className="eSchoolCalenderFixtureItem">{self.getTimeFromIso(fixture.startTime)+ ' '}</span>
						</div>
					);
				});
			} else {
				result = (
					<div className="bFixtureMessage">
						{"There aren't fixtures for current date"}
					</div>
				);
			}
		} else {
			result = (
				<div className="bFixtureMessage">
					{"Loading..."}
				</div>
			);
		}

		return result;
	},
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				upcomingLists	= self.getCalenderFixtureLists();

		return (
			<div className="eSchoolCalenderContainer">
				<div className="eSchoolFixtureTab eCalendar_tab">
					<h1>Calendar</h1><hr/>
				</div>
				<div className="eSchoolCalendarWrapper">
					<CalendarView binding={binding} />
					<div className="eSchoolCalenderFixtureList">
						<div className="eSchoolCalenderFixtureTitle">
							<span className="eSchoolCalenderFixtureItem">Sport</span>
							<span className="eSchoolCalenderFixtureItem">Date</span>
							<span className="eSchoolCalenderFixtureItem">Game Type</span>
							<span className="eSchoolCalenderFixtureItem">Time</span>
						</div>
						{upcomingLists}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = HomeCalender;