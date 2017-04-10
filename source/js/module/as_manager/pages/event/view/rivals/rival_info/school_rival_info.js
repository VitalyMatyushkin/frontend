const	React			= require('react'),
		PencilButton	= require('module/ui/pencil_button'),
		Score			= require('module/ui/score/score'),
		ScoreConsts		= require('module/ui/score/score_consts'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		propz			= require('propz');

const SchoolRivalInfo = React.createClass({
	propTypes: {
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired
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

		const points = 13;

		return (
			<div className="eEventResult_PointSideWrapper">
				<Score	isChangeMode	= {false}
						plainPoints		= {points}
						pointsStep		= {event.sport.points.pointsStep}
						pointsType		= {event.sport.points.display}
						pointsMask		= {event.sport.points.inputMask}
						onChange		= {() => {}}
						modeView		= {ScoreConsts.SCORE_MODES_VIEW.BIG}
				/>
			</div>
		);
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