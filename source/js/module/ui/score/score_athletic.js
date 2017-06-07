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

const ScoreAthletic = React.createClass({
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
	
	getClassNames: function(){
		const playerScoreClassName = classNames({
			"ePlayer_score":	true,
			"mBig":				this.props.modeView === ScoreConsts.SCORE_MODES_VIEW.BIG
		});
		
		return playerScoreClassName;
	},
	
	renderScoreViewMode: function() {
		//TODO: Add extraScore in view
		return (
			<div className={this.getClassNames()}>
				{TeamHelper.convertPoints(this.props.plainPoints, this.props.pointsType).str}
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
									onChange	= { this.props.onChangeScoreAthletic }
									modeView	= { this.props.modeView }
					/>
				</div>
				<div className={"ePlayer_scoreAthletics " + playerPlainScoreClassName}>
					<div>{ SportConsts.SPORT_ATHLETIC.EXTRA_SCORE }</div>
					<ExtraScoreAthletic
						extraScore 				= { this.props.plainExtraPoints }
						onChangeScoreAthletic 	= { this.props.onChangeScoreAthletic }
						modeView				= { this.props.modeView }
					/>
				</div>
			</div>
		);
	},
	
	getScoreAsObject: function(score){
		
		let result;
		if (typeof score.value !== 'undefined') { 	//score
			result = {
				score: {
					score: score.value,
					extraScore: this.props.plainExtraPoints
				},
				isValid: score.isValid
			};
		} else {									//extraScore
			result = {
				score: {
					score: this.props.plainPoints,
					extraScore: score
				},
				isValid: true
			};
		}
		
		
		this.props.onChangeScoreAthletic(result);
		
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
									 mask			= { mask }
									 onChange		= { this.getScoreAsObject }
									 stringToPoints	= { ScoreHelper.stringTimeToPoints }
									 validation		= { ScoreHelper.stringTimeValidation }
									 className		= { "mTime " + playerTimeScoreClassName }
									 modeView		= { this.props.modeView }
					/>
				</div>
				<div className={"ePlayer_scoreAthletics " + playerTimeScoreClassName}>
					<div>{ SportConsts.SPORT_ATHLETIC.EXTRA_SCORE }</div>
					<ExtraScoreAthletic
						extraScore 				= { this.props.plainExtraPoints }
						onChangeScoreAthletic 	= { this.getScoreAsObject }
						modeView				= { this.props.modeView }
					/>
				</div>
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
									 mask			= { mask }
									 onChange		= { this.props.onChangeScoreAthletic }
									 stringToPoints	= { ScoreHelper.stringDistanceToPoints }
									 validation		= { ScoreHelper.stringDistanceValidation }
									 className		= { "mDistance " +  playerDistanceScoreClassName}
									 modeView		= { this.props.modeView }
					/>
				</div>
				<div className={"ePlayer_scoreAthletics " + playerDistanceScoreClassName}>
					<div>{ SportConsts.SPORT_ATHLETIC.EXTRA_SCORE }</div>
					<ExtraScoreAthletic
						extraScore 				= { this.props.plainExtraPoints }
						onChangeScoreAthletic 	= { this.props.onChangeScoreAthletic }
						modeView				= { this.props.modeView }
					/>
				</div>
			</div>
		);
	},
	
	render: function () {
		if(this.props.isChangeMode) {
			return this.renderScoreAthleticChangeMode();
		} else {
			return this.renderScoreViewMode();
		}
	}
});

module.exports = ScoreAthletic;