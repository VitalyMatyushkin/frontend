const	DateTimeMixin	= require('module/mixins/datetime'),
		React			= require('react'),
		Immutable		= require('immutable'),
		EventHelper		= require('module/helpers/eventHelper'),
		Sport			= require('module/ui/icons/sport_icon');

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
	getFixtureInfo: function(event) {
		const self = this;

		if(event !== undefined){
			return(
				<div>
					<div className="bFix_date">{`${self.getDateFromIso(event.startTime)} ${self.getTimeFromIso(event.startTime)}`}</div>
					<div className="bFix_name">{event.name}</div>
					<div className="bFix_type">{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}</div>
				</div>
			)
		}
	},
	getSportIcon:function(sport){
		const	name	= sport ? sport.name : '';

		return <Sport name={name} className="bIcon_mSport" ></Sport>;
	},
	getParticipantEmblem: function(participant, type){
		const	self				= this;
		let		participantEmblem	= '';

		if(participant !== undefined){
			switch(type) {
				case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
					let teamName;

					if(self.getMoreartyContext().getBinding().get('activeSchoolId') == participant.school.id) {
						teamName = participant.name;
					} else {
						teamName = participant.school.name;
					}

					participantEmblem = (
						<div>
							<img src={participant.school.pic}/>
							<span>{teamName}</span>
						</div>
					);
					break;
				case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
					participantEmblem = (
						<div>
							<img src={participant.school.pic}/>
							<span>{participant.house.name}</span>
						</div>
					);
					break;
				case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
					participantEmblem = (
						<div>
							<img src={participant.school.pic}/>
							<span>{participant.name}</span>
						</div>
					);
					break;
			}
		}

		return participantEmblem;
	},
	getFixtureResults:function(event) {
		const self = this;

		// def values
		let	firstPoint	= "?",
			secondPoint	= "?";

		if(event.result !== undefined && event.status === EventHelper.EVENT_STATUS.FINISHED){
			const eventSummary = EventHelper.getTeamsSummaryByEventResult(event.result);

			firstPoint	= self._getLeftPoint(event, eventSummary);
			secondPoint	= self._getRightPoint(event, eventSummary);
		} else if (event.result === undefined && event.status === EventHelper.EVENT_STATUS.FINISHED) {
			// if result === undef, but event is finished, then result of event is 0:0
			// because teams doesn't have points
			firstPoint = "0";
			secondPoint  = "0";
		}

		return (
			<div>
				<div className="bFix_scoreText">{'Score'}</div>
				<div className="bFix_scoreResult">{`${firstPoint} : ${secondPoint}`}</div>
			</div>
		);
	},
	_getLeftPoint: function(event, eventSummary) {
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		const	eventType		= event.eventType,
				participants	= event.participants;

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === activeSchoolId
		) {
			return eventSummary[event.participants[0].id] !== undefined ? eventSummary[event.participants[0].id] : 0
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === activeSchoolId
		) {
			return eventSummary[event.participants[1].id] !== undefined ? eventSummary[event.participants[1].id] : 0
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return eventSummary[event.participants[0].id] !== undefined ? eventSummary[event.participants[0].id] : 0
		}
	},
	_getRightPoint: function(event, eventSummary) {
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		const	eventType		= event.eventType,
				participants	= event.participants;

		// if inter school event and participant[0] is our school
		if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId !== activeSchoolId
		) {
			return eventSummary[event.participants[0].id] !== undefined ? eventSummary[event.participants[0].id] : 0
			// if inter school event and participant[1] is our school
		} else if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId !== activeSchoolId
		) {
			return eventSummary[event.participants[1].id] !== undefined ? eventSummary[event.participants[1].id] : 0
			// if it isn't inter school event
		} else if (
			participants.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return eventSummary[event.participants[1].id] !== undefined ? eventSummary[event.participants[1].id] : 0
		}
	},
	_renderTeamLeftSide: function(event) {
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		const	eventType		= event.eventType,
				participants	= event.participants;

		if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId === activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{self.getParticipantEmblem(event.participants[0], event.eventType)}
				</div>
			);
		} else if(
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId === activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{self.getParticipantEmblem(event.participants[1], event.eventType)}
				</div>
			);
		} else if(eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{self.getParticipantEmblem(event.participants[0], event.eventType)}
				</div>
			);
		}
	},
	_renderTeamRightSide: function(event) {
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		const	eventType		= event.eventType,
				participants	= event.participants;

		// if inter school event and participant[0] is our school
		if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[0].schoolId !== activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{self.getParticipantEmblem(event.participants[0], event.eventType)}
				</div>
			);
			// if inter school event and participant[1] is our school
		} else if (
			participants.length > 1 &&
			eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
			participants[1].schoolId !== activeSchoolId
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{self.getParticipantEmblem(event.participants[1], event.eventType)}
				</div>
			);
			// if it isn't inter school event
		} else if (
			participants.length > 1 &&
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']
		) {
			return (
				<div className="bFixtureOpponent bFixture_item no-margin">
					{self.getParticipantEmblem(event.participants[1], event.eventType)}
				</div>
			);
		}
	},
	renderFixtureLists:function(){
		const	self		= this,
				binding		= self.getDefaultBinding(),
				events		= binding.toJS('fixtures'),
				selectDay	= binding.get('selectDay');
		let		result;

		if(selectDay === undefined || selectDay === null) {
			result = (
				<div className="bFixtureMessage">
					{"Please select day."}
				</div>
			);
		} else if(binding.toJS('fixturesSync')) {
			if(events !== undefined && events.length != 0){
				result = events.map(function(event){
					return (
						<div key={event.id} className="bFixtureContainer">
							<div className="bFixtureIcon bFixture_item">
								{self.getSportIcon(event.sport)}
							</div>
							<div className="bFixtureInfo bFixture_item">
								{self.getFixtureInfo(event)}
							</div>
							{self._renderTeamLeftSide(event)}
							<div className="bFixtureResult bFixture_item no-margin">
								{self.getFixtureResults(event)}
							</div>
							{self._renderTeamRightSide(event)}
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
	render:function(){
		const	self		= this,
				fixtures	= self.renderFixtureLists();

		return (
			<div className="eSchoolFixtures">
				<div className="eSchoolFixtureTab">
					<h1>Fixtures</h1><hr/>
				</div>
				{fixtures}
			</div>
		);
	}
});
module.exports = HomeFixtures;