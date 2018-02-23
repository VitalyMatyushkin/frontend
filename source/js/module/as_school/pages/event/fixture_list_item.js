const 	React 					= require('react'),
		DateTimeMixin			= require('module/mixins/datetime'),
		ChallengeModel			= require('module/ui/challenges/challenge_model'),
		{Button} 				= require('module/ui/button/button'),
		SportHelper 			= require('module/helpers/sport_helper'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		CricketResultBlock 		= require('module/as_manager/pages/event/view/cricket_result_block/cricket_result_block');

const FixtureListItem = React.createClass({
	
	mixins: [DateTimeMixin],
	
	propTypes: {
		event:				React.PropTypes.any.isRequired,
		activeSchoolId: 	React.PropTypes.string.isRequired
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
	getEventRivals: function (model) {
		if(!model.isEventWithOneIndividualTeam && !TeamHelper.isNewEvent(this.props.event)) {
			return (
				<div className="bEventRivals">

					<div className="bEventRivals_row">
						<div className="bEventRivals_column mLeft">
							<div>
								{this.renderOpponentSide(model, 0)}
							</div>
						</div>
						<div className="bEventRivals_column">
							<div>
								{this.renderOpponentSide(model, 1)}
							</div>
						</div>
					</div>
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
					activeSchoolId 	= { this.props.activeSchoolId }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const	event 			= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId, undefined, true);
		
		return (
			<div>
				<div className="bEventInfo">
					{ this.renderGameResultForCricket() }
					{ this.getEventRivals(challengeModel) }
				</div>
			</div>
		)
	}
});

module.exports = FixtureListItem;