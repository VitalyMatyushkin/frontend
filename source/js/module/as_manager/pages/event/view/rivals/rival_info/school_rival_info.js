const	React			= require('react'),
		PencilButton	= require('module/ui/pencil_button'),
		Score			= require('module/ui/score/score'),
		ScoreCricket	= require('module/ui/score/score_cricket'),
		ScoreConsts		= require('module/ui/score/score_consts'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		RivalHelper		= require('module/as_manager/pages/event/view/rivals/rival_helper'),
		propz			= require('propz');

const SchoolRivalInfo = React.createClass({
	propTypes: {
		rival:						React.PropTypes.object.isRequired,
		event:						React.PropTypes.object.isRequired,
		mode:						React.PropTypes.string.isRequired,
		onChangeScore:				React.PropTypes.func.isRequired,
		activeSchoolId:				React.PropTypes.string.isRequired
	},
	isShowChangeSchoolButton: function() {
		return (
			this.props.event.status !== EventHelper.EVENT_STATUS.FINISHED &&
			this.props.event.status !== EventHelper.EVENT_STATUS.ACCEPTED &&
			this.props.activeSchoolId !== this.props.rival.school.id
		);
	},
	getRivalName: function() {
		const	teamName	= this.getTeamName(),
				schoolName	= this.getSchoolName();

		switch (true) {
			case typeof teamName === "undefined":
				return schoolName;
			case typeof schoolName === "undefined":
				return teamName;
			default:
				return <div>{teamName} <span>/</span> {schoolName}</div>;
		}
	},
	getTeamName: function() {
		return propz.get(this.props.rival, ['team','name']); 
	},
	getSchoolName: function () {
		return this.props.rival.school.name;
	},
	getPoints: function() {
		const	schoolResults	= this.props.event.results.schoolScore,
				teamResults		= this.props.event.results.teamScore,
				teamId			= this.props.rival.team.id,
				schoolId		= this.props.rival.school.id;

		const schoolScoreData = schoolResults.find(scoreData => scoreData.schoolId === schoolId);

		let points = 0;
		if(typeof schoolScoreData !== 'undefined') {
			points = schoolScoreData.score;
		} else {
			const teamScoreData = teamResults.find(scoreData => scoreData.teamId === teamId);
			if(typeof teamScoreData !== 'undefined') {
				points = teamScoreData.score;
			}
		}

		return points;
	},
	onChangeScore: function(scoreData) {
		if(typeof this.props.rival.team === 'undefined') {
			this.props.onChangeScore('schoolScore', scoreData);
		} else {
			this.props.onChangeScore('teamScore', scoreData);
		}
	},
	renderPencilButton: function() {
		if(this.isShowChangeSchoolButton()) {
			return (
				<div className="eEventRival_buttonContainer">
					<PencilButton handleClick={this.handleClickChangeOpponentSchoolButton}/>
				</div>
			);
		} else {
			return null;
		}
	},
	renderPoints: function() {
		const event = this.props.event;

		const	isTeamSport		= TeamHelper.isTeamSport(event),
				isOneOnOneSport	= TeamHelper.isOneOnOneSport(event),
				isFinishedEvent	= event.status === "FINISHED",
				isClosingMode	= this.props.mode === 'closing';

		let xmlScore = null;
		if(
			(isTeamSport || isOneOnOneSport) &&
			(isFinishedEvent || isClosingMode)
		) {
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

		if (event.sport.name.toLowerCase() === 'cricket') {
			return (
				<div className="eEventResult_PointSideWrapper">
					<ScoreCricket	isChangeMode	= { isChangeMode }
									plainPoints		= { points }
									pointsStep		= { event.sport.points.pointsStep }
									pointsType		= { event.sport.points.display }
									pointsMask		= { event.sport.points.inputMask }
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
				{ this.renderPencilButton() }
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

module.exports = SchoolRivalInfo;