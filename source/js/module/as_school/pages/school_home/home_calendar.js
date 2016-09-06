const	CalendarView	= require('module/ui/calendar/calendar'),
		React			= require('react'),
		Immutable		= require('immutable'),
		DateTimeMixin	= require('module/mixins/datetime'),
		Sport			= require('module/ui/icons/sport_icon'),
        ChallengeModel	= require('module/ui/challenges/challenge_model'),
		Challenges		= require('module/ui/challenges/challenges'),
		EventHelper		= require('module/helpers/eventHelper'),
		MonthCalendar	= require('module/ui/calendar/month_calendar'),
		CalendarActions	= require('./CalendarActions'),
		Morearty        = require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper');

/** Block to show calendar block and list of events for selected day in calendar */
const HomeCalender = React.createClass({
	mixins:[Morearty.Mixin, DateTimeMixin],
	// componentWillMount:function(){
	// 	const	self			= this,
	// 			rootBinding		= self.getMoreartyContext().getBinding(),
	// 			activeSchoolId	= rootBinding.get('activeSchoolId');
	//
	// 	window.Server.publicSchoolEvents.get({schoolId:activeSchoolId}, {filter: {limit: 100}})
	// 		.then(events => events.filter(event => EventHelper.isShowEventOnPublicSchoolCalendar(event)))
	// 		.then(events => {
	// 			rootBinding.set('events.models',Immutable.fromJS(events));
	// 		});
	// },
	// getSportIcon: function(sport) {
	// 	return <Sport name={sport} className="calendar_mSport" ></Sport>;
	// },
	// getCalenderFixtureLists: function() {
	// 	const	self		    = this,
	// 			binding		    = self.getDefaultBinding(),
     //            activeSchoolId  = self.getMoreartyContext().getBinding().get('activeSchoolId'),
	// 			fixtureList	    = binding.get('fixtures'),
	// 			selectDay	    = binding.get('selectDay');
	// 	let		result;
	//
	// 	if(selectDay === undefined || selectDay === null) {
	// 		result = (
	// 			<div className="bFixtureMessage">
	// 				{"Please select day."}
	// 			</div>
	// 		);
	// 	} else if(binding.toJS('fixturesSync')) {
	// 		if(fixtureList !== undefined && fixtureList.size != 0) {
	// 			const	fixtures = fixtureList.toJS();
	//
	// 			result = fixtures.map(function(event){
	// 				const	fixture	= new ChallengeModel(event, activeSchoolId);
	//
	// 				const   leftSideRivalName   = self._getRivalNameLeftSide(event, fixture.rivals),
	// 						rightSideRivalName  = self._getRivalNameRightSide(event, fixture.rivals);
	//
	// 				return (
	// 					<div key={fixture.id} className="eSchoolFixtureListItem">
	// 						<span className="eSchoolCalenderFixtureItem">{self.getSportIcon(fixture.sport)}</span>
	// 						<span className="eSchoolCalenderFixtureItem">{fixture.date}</span>
	// 						<span className="eSchoolCalenderFixtureItem">{`${leftSideRivalName} vs ${rightSideRivalName}`}</span>
	// 						<span className="eSchoolCalenderFixtureItem">{fixture.time + ' '}</span>
	// 					</div>
	// 				);
	// 			});
	// 		} else {
	// 			result = (
	// 				<div className="bFixtureMessage">
	// 					{"There aren't fixtures for current date"}
	// 				</div>
	// 			);
	// 		}
	// 	} else {
	// 		result = (
	// 			<div className="bFixtureMessage">
	// 				{"Loading..."}
	// 			</div>
	// 		);
	// 	}
	//
	// 	return result;
	// },
	// _getRivalNameLeftSide: function(event, rivals) {
	// 	const	self			= this,
	// 			rootBinding		= self.getMoreartyContext().getBinding(),
	// 			activeSchoolId	= rootBinding.get('activeSchoolId');
	//
	// 	const	eventType       = event.eventType,
	// 			participants    = event.participants;
	//
	// 	// TODO: fix me
	// 	return 'n/a';
	// 	// if(
	// 	// 	eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
	// 	// 	participants[0].schoolId === activeSchoolId
	// 	// ) {
	// 	// 	return rivals.find(rival => rival.id === participants[0].id).name;
	// 	// } else if(
	// 	// 	eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
	// 	// 	participants[1].schoolId === activeSchoolId
	// 	// ) {
	// 	// 	return rivals.find(rival => rival.id === participants[1].id).name;
	// 	// } else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
	// 	// 	return rivals.find(rival => rival.id === participants[0].id).name;
	// 	// }
	// },
	// _getRivalNameRightSide: function(event, rivals) {
	// 	const	self			= this,
	// 			rootBinding		= self.getMoreartyContext().getBinding(),
	// 			activeSchoolId	= rootBinding.get('activeSchoolId');
	//
	// 	const	eventType		= event.eventType,
	// 			participants	= event.participants;
	//
	// 	// TODO: fix me
	// 	return 'n/a';
	//
	// 	// if inter school event and participant[0] is our school
	// 	// if (
	// 	// 	participants.length > 1 &&
	// 	// 	eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
	// 	// 	participants[0].schoolId !== activeSchoolId
	// 	// ) {
	// 	// 	return rivals.find(rival => rival.id === participants[0].id).name;
	// 	// 	// if inter school event and participant[1] is our school
	// 	// } else if (
	// 	// 	participants.length > 1 &&
	// 	// 	eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
	// 	// 	participants[1].schoolId !== activeSchoolId
	// 	// ) {
	// 	// 	return rivals.find(rival => rival.id === participants[1].id).name;
	// 	// 	// if inter school event and opponent school is not yet accept invitation
	// 	// } else if(
	// 	// 	participants.length === 1 &&
	// 	// 	eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
	// 	// ) {
	// 	// 	return rivals.find(rival => rival.id === null).name;
	// 	// 	// if it isn't inter school event
	// 	// } else if (
	// 	// 	participants.length > 1 &&
	// 	// 	eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
	// 	// ) {
	// 	// 	return rivals.find(rival => rival.id === participants[1].id).name;
	// 	// }
	// },
	// render: function() {
	// 	const	self			= this,
	// 			binding			= self.getDefaultBinding(),
	// 			upcomingLists	= self.getCalenderFixtureLists();
	//
	// 	return (
	// 		<div className="eSchoolCalenderContainer">
	// 			<div className="eSchoolFixtureTab eCalendar_tab">
	// 				<h1>Calendar</h1><hr/>
	// 			</div>
	// 			<div className="eSchoolCalendarWrapper">
	// 				<CalendarView binding={binding} />
	// 				<div className="eSchoolCalenderFixtureList">
	// 					<div className="eSchoolCalenderFixtureTitle">
	// 						<span className="eSchoolCalenderFixtureItem">Sport</span>
	// 						<span className="eSchoolCalenderFixtureItem">Date</span>
	// 						<span className="eSchoolCalenderFixtureItem">Game Type</span>
	// 						<span className="eSchoolCalenderFixtureItem">Time</span>
	// 					</div>
	// 					{upcomingLists}
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	componentWillMount: function () {
		const 	binding 				= this.getDefaultBinding().sub('events'),
				activeSchoolId			= this.getMoreartyContext().getBinding().get('activeSchoolId');

		/** Loading initial data for this month */
		CalendarActions.setCurrentMonth(new Date(), activeSchoolId, binding);
	},

	render: function(){
		const 	binding 				= this.getDefaultBinding().sub('events'),
				activeSchoolId			= this.getMoreartyContext().getBinding().get('activeSchoolId'),
				todayDate				= binding.get('todayDate'),
				monthDate				= binding.get('monthDate'),
				selectedDate			= binding.get('selectedDate'),
				isDistinctDatesInSync	= binding.get('distinctEventDatesData.isSync'),
				distinctDates			= binding.get('distinctEventDatesData.dates');

		/** Converting array of dates to proper calendar format */
		let eventsData = {};
		if(isDistinctDatesInSync === true) {
			distinctDates.forEach( date => {
				eventsData[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] = true;
			})
		}

		return (
			<div className="eSchoolCalenderContainer">
				<div className="eSchoolFixtureTab eCalendar_tab">
					<h1>Calendar</h1><hr/>
				</div>
				<div className="eSchoolCalendarWrapper">
					<div className="bCalendar">
						<MonthCalendar
							monthDate={monthDate}
							todayDate={todayDate}
							selectedDate={selectedDate}
							onNextMonthClick={ () => CalendarActions.setNextMonth(activeSchoolId, binding) }
							onPrevMonthClick={ () => CalendarActions.setPrevMonth(activeSchoolId, binding) }
							onDateClick={ (date) => CalendarActions.setSelectedDate(date, activeSchoolId, binding) }
							eventsData={Immutable.fromJS(eventsData)}
						/>
					</div>
					<div className="eSchoolCalenderFixtureList">
						<div className="eSchoolCalenderFixtureTitle">
							<span className="eSchoolCalenderFixtureItem">Sport</span>
							<span className="eSchoolCalenderFixtureItem">Date</span>
							<span className="eSchoolCalenderFixtureItem">Game Type</span>
							<span className="eSchoolCalenderFixtureItem">Time</span>
						</div>
						{/*upcomingLists*/}
					</div>

				</div>
			</div>
		);
	}
});

module.exports = HomeCalender;