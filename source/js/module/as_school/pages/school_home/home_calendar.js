const	CalendarView	= require('module/ui/calendar/calendar'),
		React			= require('react'),
		Immutable		= require('immutable'),
		DateTimeMixin	= require('module/mixins/datetime'),
		Sport			= require('module/ui/icons/sport_icon'),
        ChallengeModel	= require('module/ui/challenges/challenge_model'),
		Superuser		= require('module/helpers/superuser');

const HomeCalender = React.createClass({
	mixins:[Morearty.Mixin,DateTimeMixin],
	componentWillMount:function(){
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		window.Server.publicSchoolEvents.get({schoolId:activeSchoolId})
			.then((events) => {
				rootBinding.set('events.models',Immutable.fromJS(events));
			});
	},
	getSportIcon: function(sport) {
		return <Sport name={sport} className="calendar_mSport" ></Sport>;
	},
	getCalenderFixtureLists: function() {
		const	self		    = this,
				binding		    = self.getDefaultBinding(),
                activeSchoolId  = self.getMoreartyContext().getBinding().get('activeSchoolId'),
				fixtureList	    = binding.get('fixtures'),
				selectDay	    = binding.get('selectDay');
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

				result = fixtures.map(function(event){
					const	fixture	= new ChallengeModel(event, activeSchoolId);

					return (
						<div key={fixture.id} className="eSchoolFixtureListItem">
							<span className="eSchoolCalenderFixtureItem">{self.getSportIcon(fixture.sport)}</span>
							<span className="eSchoolCalenderFixtureItem">{fixture.date}</span>
							<span className="eSchoolCalenderFixtureItem">{`${fixture.rivals[0]} vs ${fixture.rivals[1]}`}</span>
							<span className="eSchoolCalenderFixtureItem">{fixture.time+ ' '}</span>
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