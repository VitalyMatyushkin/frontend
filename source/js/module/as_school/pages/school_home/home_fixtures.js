const	DateTimeMixin	= require('module/mixins/datetime'),
		React			= require('react'),
		Immutable		= require('immutable'),
		Sport			= require('module/ui/icons/sport_icon'),
		Superuser		= require('module/helpers/superuser');

const HomeFixtures = React.createClass({
	mixins:[Morearty.Mixin,DateTimeMixin],
	componentWillMount: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

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
		//TODO: Do we need this as we now have public and private views?
		// Superuser.runAsSuperUser(rootBinding, () => {
		// 	return window.Server.fixturesBySchoolId.get(
		// 		{
		// 			schoolId: activeSchoolId,
		// 			filter: {
		// 				order: 'startTime ASC'
		// 			}
		// 		}
		// 	).then((events) => {
		// 		const filteredEvents = events.filter((event) => {
		// 			const	eventDate	= new Date(event.startTime).toLocaleDateString(),
		// 					currentDate	= date.toLocaleDateString();
        //
		// 			return currentDate == eventDate;
		// 		});
        //
		// 		binding
		// 			.atomically()
		// 			.set('fixtures',Immutable.fromJS(filteredEvents))
		// 			.set('fixturesSync',Immutable.fromJS(true))
		// 			.commit();
		// 	});
		// });
	},
	getFixtureInfo: function(event) {
		const	self	= this;

		if(event !== undefined){
			return(
				<div>
					<div className="bFix_date">{`${self.getDateFromIso(event.startTime)} ${self.getTimeFromIso(event.startTime)}`}</div>
					<div className="bFix_name">{event.name}</div>
					<div className="bFix_type">{event.type}</div>
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
				case 'inter-schools':
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
				case 'houses':
					participantEmblem = (
						<div>
							<img src={participant.school.pic}/>
							<span>{participant.house.name}</span>
						</div>
					);
					break;
				case 'internal':
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
	getFixtureResults:function(event){
		if(event.result !== undefined){
			const	teamSummary	= event.result.summary.byTeams,
					firstPoint	=  teamSummary[event.participants[0].id] !== undefined ? teamSummary[event.participants[0].id] : 0,
					secondPoint	= teamSummary[event.participants[1].id] !== undefined ? teamSummary[event.participants[1].id] : 0;

			return(
				<div>
					<div className="bFix_scoreText">{'Score'}</div>
					<div className="bFix_scoreResult">{`${firstPoint} : ${secondPoint}`}</div>
				</div>
			);
		}else{
			return(
				<div>
					<div className="bFix_scoreText">{'Score'}</div>
					<div className="bFix_scoreResult">{'? : ?'}</div>
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
							<div className="bFixtureOpponent bFixture_item no-margin">
								{self.getParticipantEmblem(event.participants[0], event.type)}
							</div>
							<div className="bFixtureResult bFixture_item no-margin">
								{self.getFixtureResults(event)}
							</div>
							<div className="bFixtureOpponent bFixture_item no-margin">
								{self.getParticipantEmblem(event.participants[1], event.type)}
							</div>
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