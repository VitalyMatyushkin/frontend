const	React			= require('react'),
		Score			= require('module/ui/score/score'),
		ScoreCricket	= require('module/ui/score/score_cricket'),
		ScoreConsts		= require('module/ui/score/score_consts'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		SportHelper 	= require('module/helpers/sport_helper'),
		RivalHelper		= require('module/as_manager/pages/event/view/rivals/rival_helper'),
		propz			= require('propz');

const InternalRivalInfo = React.createClass({
	propTypes: {
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		onChangeScore:	React.PropTypes.func.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	getRivalName: function() {
		const teamName = this.getTeamName();

		return <div>{teamName}</div>;
	},
	getTeamName: function() {
		return propz.get(this.props.rival, ['team','name']); 
	},
	getHouseName: function () {
		return this.props.rival.house.name;
	},
	getPoints: function() {
		const	teamResults		= this.props.event.results.teamScore,
				teamId			= propz.get(this.props.rival, ['team','id']);

		let points = 0;
		if(typeof teamId !== 'undefined') {
			const teamScoreData = teamResults.find(scoreData => scoreData.teamId === teamId);
			if(typeof teamScoreData !== 'undefined') {
				points = teamScoreData.score;
			}
		}

		return points;
	},
	onChangeScore: function(scoreData) {
		this.props.onChangeScore('teamScore', scoreData);
	},
	renderPoints: function() {
		const event = this.props.event;

		const	isFinishedEvent	= event.status === "FINISHED",
				isClosingMode	= this.props.mode === 'closing';

		let xmlScore = null;
		if(isFinishedEvent || isClosingMode) {
			xmlScore = this.renderCountPoints();
		}

		return (
			<div className="eEventRival_score">
				{ xmlScore }
			</div>
		);
	},
	renderCountPoints: function() {
		const event = this.props.event;

		const points = this.getPoints();

		const isChangeMode = RivalHelper.isShowScoreButtons(
			event,
			this.props.mode,
			true
		) && !this.props.rival.isIndividualScoreAvailable;
		
		//For cricket we use separate component (because cricket no usual game, with very strange rules)
		//We save score in format {number}: <Runs>999.<Wickets>9 (example 200.5, mean Runs: 200, Wickets: 5)
		if (SportHelper.isCricket(event.sport.name)) {
			return (
				<div className="eEventResult_PointSideWrapper">
					<ScoreCricket	isChangeMode	= { isChangeMode }
									plainPoints		= { points }
									pointsStep		= { event.sport.points.pointsStep }
									pointsType		= { event.sport.points.display }
									onChange		= { this.onChangeScore }
									modeView		= { ScoreConsts.SCORE_MODES_VIEW.BIG }
					/>
				</div>
			);
		} else {
			return (
				<div className="eEventResult_PointSideWrapper">
					<Score	isChangeMode	= { isChangeMode }
							plainPoints		= { points }
							pointsStep		= { event.sport.points.pointsStep }
							pointsType		= { event.sport.points.display }
							pointsMask		= { event.sport.points.inputMask }
							onChange		= { this.onChangeScore }
							modeView		= { ScoreConsts.SCORE_MODES_VIEW.BIG }
					/>
				</div>
			);
		}
	},
	render: function() {
		return (
			<div className="bEventRival">
				<div className="eEventRival_logo">
					<img	className="eEventRivals_logoPic"
							src={this.props.rival.school.pic}
					/>
				</div>
				<div className="eEventRival_rivalName">
					{ this.getRivalName() }
				</div>
				{ this.renderPoints() }
			</div>
		);
	}
});

module.exports = InternalRivalInfo;