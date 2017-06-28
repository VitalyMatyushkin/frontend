/**
 * Created by Woland on 01.06.2017.
 */

const	React				= require('react'),

		classNames			= require('classnames'),

		TeamHelper  		= require('module/ui/managers/helpers/team_helper'),
		SportConsts			= require('module/helpers/consts/sport'),
		ScoreHelper 		= require('./score_helper'),
		MaskedPoints 		= require('./masked-points'),
		PlainPoints 		= require('./plain-points'),
		ExtraScoreAthletic 	= require('./extra_score_athletic'),
		ScoreConsts			= require('./score_consts');

const AthleticScore = React.createClass({
	propTypes: {
		isChangeMode:				React.PropTypes.bool,
		plainPoints:				React.PropTypes.number.isRequired,
		plainExtraPoints:			React.PropTypes.number.isRequired,
		pointsType:					React.PropTypes.string.isRequired,
		pointsStep:					React.PropTypes.number,
		onChangeScoreAthletic:		React.PropTypes.func.isRequired,
		modeView:					React.PropTypes.string,
		isPlayerScore: 				React.PropTypes.bool
	},
	getDefaultProps: function() {
		return {
			isChangeMode:	false,
			modeView:		ScoreConsts.SCORE_MODES_VIEW.SMALL,
			isPlayerScore: 	false
		};
	},
	getScoreAsObject: function(score){
		let result;
		//score can be object and number, if score is object then it has property "value", else score just number
		if (typeof score.value !== 'undefined') { 	//score
			result = {
				scoreAthletic: {
					score: score.value,
					extraScore: this.props.plainExtraPoints
				},
				isValid: score.isValid
			};
		} else {									//extraScore
			result = {
				scoreAthletic: {
					score: this.props.plainPoints,
					extraScore: score
				},
				isValid: true
			};
		}
		
		
		this.props.onChangeScoreAthletic(result);
		
	},
	renderScoreViewMode: function() {
		const mask = this.props.pointsMask ? this.props.pointsMask : ScoreHelper.DEFAULT_TIME_MASK;

		const playerScoreClassName = classNames({
			"ePlayer_score":	true,
			"mBig":				this.props.modeView === ScoreConsts.SCORE_MODES_VIEW.BIG,
			"bTooltip":			true
		});

		let	mainPoints,
			tooltip = `${TeamHelper.convertPoints(this.props.plainPoints, this.props.pointsType).str} / Score ${this.props.plainExtraPoints}`;

		// points type
		switch (this.props.pointsType) {
			case SportConsts.SPORT_POINTS_TYPE.PLAIN:
				mainPoints = TeamHelper.convertPoints(this.props.plainPoints, this.props.pointsType).str;
				break;
			case SportConsts.SPORT_POINTS_TYPE.TIME:
				mainPoints = ScoreHelper.plainPointsToTimeString(this.props.plainPoints, mask, '.');
				break;
			case SportConsts.SPORT_POINTS_TYPE.DISTANCE:
				mainPoints = ScoreHelper.plainPointsToDistanceString(this.props.plainPoints, mask, '.');
				break;
		}

		return (
			<div
				className			= {playerScoreClassName}
				data-description	= {tooltip}
			>
				{`${mainPoints} / Score ${this.props.plainExtraPoints}`}
			</div>
		);
	},
	renderScoreAthleticChangeMode: function() {
		// points type
		switch (this.props.pointsType) {
			case SportConsts.SPORT_POINTS_TYPE.PLAIN:
				return this.renderPlayerPlainPointsInChangeMode();
			case SportConsts.SPORT_POINTS_TYPE.TIME:
				return this.renderPlayerTimePointsInChangeMode();
			case SportConsts.SPORT_POINTS_TYPE.DISTANCE:
				return this.renderPlayerDistancePointsInChangeMode();
		}
	},
	
	renderPlayerPlainPointsInChangeMode: function(){
		const playerPlainScoreClassName = classNames({
			"mMedium":	this.props.isPlayerScore
		});
		
		return (
			<div>
				<div className={"ePlayer_scoreAthletics " + playerPlainScoreClassName}>
					<div>{ SportConsts.SPORT_ATHLETIC.PLAIN }</div>
					<PlainPoints	plainPoints	= { this.props.plainPoints }
									step		= { this.props.pointsStep }
									onChange	= { this.getScoreAsObject }
									modeView	= { this.props.modeView }
					/>
				</div>
				{ this.renderPlayerExtraScoreInChangeMode() }
			</div>
		);
	},
	
	renderPlayerTimePointsInChangeMode: function() {
		const mask = this.props.pointsMask ? this.props.pointsMask : ScoreHelper.DEFAULT_TIME_MASK;
		
		const playerTimeScoreClassName = classNames({
			"mMedium":	this.props.isPlayerScore
		});
		
		return (
			<div>
				<div className={"ePlayer_scoreAthletics " + playerTimeScoreClassName}>
					<div>{ SportConsts.SPORT_ATHLETIC.TIME }</div>
					<MaskedPoints	plainPoints		= { this.props.plainPoints }
									value			= { ScoreHelper.plainPointsToTimeString(this.props.plainPoints, mask, ':') }
									mask			= { mask }
									onChange		= { this.getScoreAsObject }
									stringToPoints	= { ScoreHelper.stringTimeToPoints }
									validation		= { ScoreHelper.stringTimeValidation }
									className		= { "mTime " + playerTimeScoreClassName }
									modeView		= { this.props.modeView }
					/>
				</div>
				{ this.renderPlayerExtraScoreInChangeMode() }
			</div>
		);
	},
	renderPlayerDistancePointsInChangeMode: function() {
		const mask = this.props.pointsMask ? this.props.pointsMask : ScoreHelper.DEFAULT_DISTANCE_MASK;
		
		const playerDistanceScoreClassName = classNames({
			"mMedium":		this.props.isPlayerScore
		});
		
		return (
			<div>
				<div className={"ePlayer_scoreAthletics " + playerDistanceScoreClassName}>
					<div>{ SportConsts.SPORT_ATHLETIC.DISTANCE }</div>
					<MaskedPoints	plainPoints		= { this.props.plainPoints }
									value			= { ScoreHelper.plainPointsToDistanceString(this.props.plainPoints, mask, ':') }
									mask			= { mask }
									onChange		= { this.getScoreAsObject }
									stringToPoints	= { ScoreHelper.stringDistanceToPoints }
									validation		= { ScoreHelper.stringDistanceValidation }
									className		= { "mDistance " +  playerDistanceScoreClassName}
									modeView		= { this.props.modeView }
					/>
				</div>
				{ this.renderPlayerExtraScoreInChangeMode() }
			</div>
		);
	},
	
	renderPlayerExtraScoreInChangeMode: function(){
		const playerDistanceScoreClassName = classNames({
			"mMedium":		this.props.isPlayerScore
		});
		
		return (
			<div className={"ePlayer_scoreAthletics " + playerDistanceScoreClassName}>
				<div>{ SportConsts.SPORT_ATHLETIC.EXTRA_SCORE }</div>
				<ExtraScoreAthletic
					extraScore 				= { this.props.plainExtraPoints }
					onChangeScoreAthletic 	= { this.getScoreAsObject }
					modeView				= { this.props.modeView }
				/>
			</div>
		)
	},
	
	render: function () {
		if(this.props.isChangeMode) {
			return this.renderScoreAthleticChangeMode();
		} else {
			return this.renderScoreViewMode();
		}
	}
});

module.exports = AthleticScore