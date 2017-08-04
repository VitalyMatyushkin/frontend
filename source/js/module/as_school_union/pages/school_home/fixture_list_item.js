const 	React 					= require('react'),
		DateTimeMixin			= require('module/mixins/datetime'),
		EventHelper				= require('module/helpers/eventHelper'),
		SportHelper 			= require('module/helpers/sport_helper'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		SportIcon				= require('module/ui/icons/sport_icon'),
		ChallengeModel			= require('module/ui/challenges/challenge_model'),
		CricketResultBlock 		= require('module/as_manager/pages/event/view/cricket_result_block/cricket_result_block');

const FixtureListItem = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:				React.PropTypes.any.isRequired,
		activeSchoolId: 	React.PropTypes.string.isRequired,
		onClickViewMode: 	React.PropTypes.func
	},
	handleClickFixtureItem: function() {
		document.location.hash = `event/${this.props.event.id}`;
	},
	getFixtureInfo: function(event) {
		return(
			<div>
				<div className="eEventHeader_field mEvent">{event.generatedNames.official}</div>
				<div className="eEventHeader_field mDate">
					{`${this.getDateFromIso(event.startTime)} / ${this.getTimeFromIso(event.startTime)} / ${event.sport.name}`}
				</div>
				{ this.renderViewModeLinks() }
			</div>
		)
	},
	renderOpponentSide: function (model, order) {
		const 	rivalStyle 	= model === 0 ? '' : 'mRight',
				event 		= this.props.event;
			
			if (SportHelper.isCricket(model.sport)) {
			//In model.scoreAr format score {string}: <Runs>999/<Wickets>9 (example 200/5, mean Runs: 200, Wickets: 5)
			const 	runs 	= model.scoreAr[order].split('/')[0],
					wickets = model.scoreAr[order].split('/')[1];
			
			return (
				<div className={"bEventRival " + rivalStyle}>
					<div className="eEventRival_logo">
						<img className="eEventRivals_logoPic" src={model.rivals[order].schoolPic}/>
					</div>
					<div className="eEventRival_rivalName">{model.rivals[order].value}</div>
					<div className="eEventRival_score">
						<div className="ePlayer_score mMedium">{`Runs ${runs} / Wickets ${wickets}`}</div>
					</div>
				</div>
			);
		} else if (TeamHelper.isInterSchoolsEventForIndividualSport(event)) {
			return null;
		} else {
			return (
				<div className={"bEventRival " + rivalStyle}>
					<div className="eEventRival_logo">
						<img className="eEventRivals_logoPic" src={model.rivals[order].schoolPic}/>
					</div>
					<div className="eEventRival_rivalName">{model.rivals[order].value}</div>
					<div className="eEventRival_score">
						<div className="ePlayer_score mBig">{`${model.scoreAr[order]}`}</div>
					</div>
				</div>
			);
		}
	},
	renderViewModeLinks: function(){
		const event = this.props.event;
		
		if (TeamHelper.isInterSchoolsEventForIndividualSport(event)) {
			return (
				<div className="bEventViewMode">
					<a
						className	= "eEventViewModeLink"
						onClick		= { () => {this.props.onClickViewMode('general')} }
						key 		= "general"
					>
						Show Separate
					</a>
					<a
						className 	= "eEventViewModeLink"
						onClick 	= { () => {this.props.onClickViewMode('show_all')} }
						key 		= "showAll"
					>
						Show All
					</a>
				</div>
			);
		} else {
			return null;
		}
	},
	renderGameResultForCricket: function(){
		const sportName = this.props.event.sport.name.toLowerCase();
		
		if (SportHelper.isCricket(sportName)) {
			return (
				<CricketResultBlock
					event 			= { this.props.event }
					activeSchoolId 	= { '' } // for school union public site we don't use activeSchoolId
				/>
			);
		} else {
			return null;
		}
	},
	getEventRivals: function (model) {
		if(!model.isEventWithOneIndividualTeam)
			return (
				<div>
					{ this.renderGameResultForCricket() }
					<div className="bEventRivals_row">
						<div className="bEventRivals_column mLeft">
							<div>
								{ this.renderOpponentSide(model, 0) }
							</div>
						</div>
						<div className="bEventRivals_column">
							<div>
								{ this.renderOpponentSide(model, 1) }
							</div>
						</div>
					</div>
				</div>

			);

		return null;
	},
	handleClickGoBack: function() {
		document.location.hash = 'home';
		document.location.reload();
	},
	render: function() {
		const 	event 			= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId);

		return (
			<div>
				<div className="bEventHeader">
					<div className="bEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">
							{this.getFixtureInfo(event)}
						</div>
					</div>

					<div className="bEventHeader_rightSide">
						<div	onClick		= { this.handleClickGoBack }
								className	= "bButton mCancel"
							>
							Go Back
						</div>
					</div>
				</div>

				<div className="bEventInfo">
					{this.getEventRivals(challengeModel)}
				</div>
			</div>
		)
	}
});

module.exports = FixtureListItem;
