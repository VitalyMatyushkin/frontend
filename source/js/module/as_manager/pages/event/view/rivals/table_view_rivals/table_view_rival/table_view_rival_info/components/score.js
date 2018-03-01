const	React						= require('react');

const	propz						= require('propz');

const	DefaultScore				= require('module/ui/score/score'),
		ScoreCricket				= require('module/ui/score/score_cricket');

const	ScoreConsts					= require('module/ui/score/score_consts'),
		RivalHelper					= require('module/as_manager/pages/event/view/rivals/rival_helper'),
		TeamHelper					= require('module/ui/managers/helpers/team_helper'),
		SportHelper 				= require('module/helpers/sport_helper');

const	TableViewRivalScoreStyle	= require('../../../../../../../../../../../styles/ui/b_table_view_rivals/b_table_view_rival_score.scss');

const Score = React.createClass({
	propTypes: {
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		onChangeScore:	React.PropTypes.func.isRequired,
		isPublicSite:   React.PropTypes.bool.isRequired
	},
	getSettings: function () {
		return this.props.event.settings.find(s => s.schoolId === this.props.activeSchoolId);
	},
	isDisplayResultsOnPublic: function () {
		const settings = this.getSettings();

		return typeof settings !== 'undefined' ? settings.isDisplayResultsOnPublic : true;
	},
	getPoints: function() {
		const	schoolResults	= this.props.event.results.schoolScore,
				teamResults		= this.props.event.results.teamScore,
				teamId			= propz.get(this.props.rival, ['team','id']),
				schoolId		= this.props.rival.school.id;

		const schoolScoreData = schoolResults.find(scoreData => scoreData.schoolId === schoolId);

		let points = 0;
		if(typeof schoolScoreData !== 'undefined') {
			points = schoolScoreData.score;
		} else if(typeof teamId !== 'undefined') {
			const teamScoreData = teamResults.find(scoreData => scoreData.teamId === teamId);
			if(typeof teamScoreData !== 'undefined') {
				points = teamScoreData.score;
			}
		}

		return points;
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
					<ScoreCricket
						isChangeMode	= { isChangeMode }
						plainPoints		= { points }
						pointsStep		= { event.sport.points.pointsStep }
						pointsType		= { event.sport.points.display }
						onChange		= { this.onChangeScore }
						modeView		= { ScoreConsts.SCORE_MODES_VIEW.SMALL }
					/>
				</div>
			);
		} else {
			return (
				<div className="eEventResult_PointSideWrapper">
					<DefaultScore
						isChangeMode	= { isChangeMode }
						plainPoints		= { points }
						pointsStep		= { event.sport.points.pointsStep }
						pointsType		= { event.sport.points.display }
						pointsMask		= { event.sport.points.inputMask }
						onChange		= { this.onChangeScore }
						modeView		= { ScoreConsts.SCORE_MODES_VIEW.SMALL }
					/>
				</div>
			);
		}
	},
	onChangeScore: function(scoreData) {
		if(typeof this.props.rival.team === 'undefined') {
			this.props.onChangeScore('schoolScore', scoreData);
		} else {
			this.props.onChangeScore('teamScore', scoreData);
		}
	},
	render: function() {
		const event = this.props.event;

		const	isTeamSport		= TeamHelper.isTeamSport(event),
				isOneOnOneSport	= TeamHelper.isOneOnOneSport(event),
				isFinishedEvent	= event.status === "FINISHED",
				isClosingMode	= this.props.mode === 'closing';

		let score = null;
		if(
			// Doesn't show scores if it's a public site and isDisplayResultsOnPublic === false
			(this.props.isPublicSite ? this.isDisplayResultsOnPublic() : true) &&
			(isTeamSport || isOneOnOneSport) &&
			(isFinishedEvent || isClosingMode)
		) {
			score = this.renderCountPoints();
		} else {
			score = '-';
		}

		return (
			<div className="bTableViewRivalScore">
				{ score }
			</div>
		);
	}
});

module.exports = Score;