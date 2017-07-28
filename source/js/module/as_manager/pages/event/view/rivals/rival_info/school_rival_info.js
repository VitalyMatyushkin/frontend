const	React					= require('react'),
		PencilButton			= require('module/ui/pencil_button'),
		CircleCrossButton		= require('module/ui/circle_cross_button'),
		Score					= require('module/ui/score/score'),
		ScoreCricket			= require('module/ui/score/score_cricket'),
		ScoreConsts				= require('module/ui/score/score_consts'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		EventHelper				= require('module/helpers/eventHelper'),
		SportHelper 			= require('module/helpers/sport_helper'),
		RivalHelper				= require('module/as_manager/pages/event/view/rivals/rival_helper'),
		ChallengeModelHelper	= require('module/ui/challenges/challenge_model_helper'),
		SchoolRivalInfoConsts	= require('module/as_manager/pages/event/view/rivals/rival_info/consts/school_rival_info_consts'),
		propz					= require('propz');

const SchoolRivalInfo = React.createClass({
	propTypes: {
		rival:									React.PropTypes.object.isRequired,
		event:									React.PropTypes.object.isRequired,
		mode:									React.PropTypes.string.isRequired,
		onChangeScore:							React.PropTypes.func.isRequired,
		activeSchoolId:							React.PropTypes.string.isRequired,
		options:								React.PropTypes.object
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
	onChangeScore: function(scoreData) {
		if(typeof this.props.rival.team === 'undefined') {
			this.props.onChangeScore('schoolScore', scoreData);
		} else {
			this.props.onChangeScore('teamScore', scoreData);
		}
	},
	/**
	 * Universal handler for 'click' button event
	 * @param buttonData - button data with button id, button type and other information
	 */
	handleClickButton: function(buttonData) {
		buttonData.handler(this.props.rival.id);
	},
	renderButtons: function() {
		let buttonsContainer = null;

		let buttons = [];
		const buttonDataArray = propz.get(this.props, ['options', 'buttonsList']);
		if(typeof buttonDataArray !== 'undefined') {
			buttons = buttonDataArray
				.filter(buttonData => buttonData.isShow)
				.map(buttonData => {
					switch (buttonData.type) {
						case (SchoolRivalInfoConsts.BUTTON_TYPES.OPPONENT_SCHOOL_MANAGER_BUTTON): {
							return this.renderOpponentSchoolManagerButton(buttonData);
						}
						case (SchoolRivalInfoConsts.BUTTON_TYPES.REMOVE_TEAM_BUTTON): {
							return this.renderRemoveTeamButton(buttonData);
						}
					}
				});
		}

		if(buttons.length > 0) {
			buttonsContainer = (
				<div className="eEventRival_buttonContainer">
					{ buttons }
				</div>
			);
		}

		return buttonsContainer;
	},
	renderPlaceMedal: function() {
		let medal = null;

		if(!EventHelper.isNotFinishedEvent(this.props.event) && this.props.event.invitedSchoolIds.length > 1) {
			const	places		= ChallengeModelHelper.getSortedPlaceArrayForInterSchoolsMultipartyTeamEvent(this.props.event),
					placeData	= places.find(p => p.schoolIds.find(id => id === this.props.rival.school.id));

			let placeNameStyle;
			if (typeof placeData !== 'undefined') {
				switch (placeData.place) {
					case 1:
						placeNameStyle = 'mFirstPlace';
						break;
					case 2:
						placeNameStyle = 'mSecondPlace';
						break;
					case 3:
						placeNameStyle = 'mThirdPlace';
						break;
				}
			}

			if(typeof placeNameStyle !== "undefined") {
				medal = (
					<div className={'eEventRival_medal ' + placeNameStyle}>
					</div>
				);
			}
		}

		return medal;
	},
	renderOpponentSchoolManagerButton: function(buttonData) {
		return (
			<PencilButton
				id			= { buttonData.id }
				handleClick	= { this.handleClickButton.bind(this, buttonData) }
			/>
		);
	},
	renderRemoveTeamButton: function(buttonData) {
		return (
			<CircleCrossButton
				id				= { buttonData.id }
				extraClassName	= "mMarginLeftFixed10"
				handleClick		= { this.handleClickButton.bind(this, buttonData) }
			/>
		);
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
				{ this.renderPlaceMedal() }
				{ this.renderButtons() }
				<div className="eEventRival_logo">
					<img
						className	= "eEventRivals_logoPic"
						src			= {this.props.rival.school.pic}
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