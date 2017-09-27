const	React			= require('react'),

		classNames		= require('classnames'),

		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		SportConsts		= require('module/helpers/consts/sport'),
		ScoreHelper		= require('./score_helper'),
		PlainPoints		= require('./plain-points'),
		PresenceOnly	= require('./presence-only'),
		MaskedPoints	= require('./masked-points'),
		ScoreConsts		= require('./score_consts'),

		TooltipStyle	= require('../../../../styles/ui/b_tooltip.scss');

const Score = React.createClass({
	propTypes: {
		isChangeMode:	React.PropTypes.bool,
		presence:		React.PropTypes.number,
		plainPoints:	React.PropTypes.number,
		pointsType:		React.PropTypes.string.isRequired,
		pointsStep:		React.PropTypes.number,
		pointsMask:		React.PropTypes.string,
		onChange:		React.PropTypes.func.isRequired,
		modeView:		React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			isChangeMode:	false,
			modeView:		ScoreConsts.SCORE_MODES_VIEW.SMALL
		};
	},

	renderScoreViewMode: function() {
		const mask = this.props.pointsMask ? this.props.pointsMask : ScoreHelper.DEFAULT_TIME_MASK;

		const playerScoreClassName = classNames({
			"ePlayer_score":	true,
			"mBig":				this.props.modeView === ScoreConsts.SCORE_MODES_VIEW.BIG,
			"bTooltip":         true
		});

		let	result;
		// let	result,
		// 	tooltip = TeamHelper.convertPoints(this.props.plainPoints, this.props.pointsType).str;

		// points type
		switch (this.props.pointsType) {
			case SportConsts.SPORT_POINTS_TYPE.PLAIN:
				result = TeamHelper.convertPoints(this.props.plainPoints, this.props.pointsType).str;
				break;
			case SportConsts.SPORT_POINTS_TYPE.TIME:
				result = ScoreHelper.plainPointsToTimeString(this.props.plainPoints, mask, '.');
				break;
			case SportConsts.SPORT_POINTS_TYPE.DISTANCE:
				result = ScoreHelper.plainPointsToDistanceString(this.props.plainPoints, mask, '.');
				break;
			case SportConsts.SPORT_POINTS_TYPE.PRESENCE_ONLY:
				result = this.props.presence === 1 ? 'Presence' : 'No presence';
				break;
		}

		return (
			<div
				className			= {playerScoreClassName}
				// data-description	= {tooltip}
			>
				{result}
			</div>
		);
	},
	renderScoreChangeMode: function() {
		const self = this;

		// points type
		switch (self.props.pointsType) {
			case SportConsts.SPORT_POINTS_TYPE.PLAIN:
				return self.renderPlayerPlainPointsInChangeMode();
			case SportConsts.SPORT_POINTS_TYPE.TIME:
				return self.renderPlayerTimePointsInChangeMode();
			case SportConsts.SPORT_POINTS_TYPE.DISTANCE:
				return self.renderPlayerDistancePointsInChangeMode();
			case SportConsts.SPORT_POINTS_TYPE.PRESENCE_ONLY:
				return self.renderPlayerPresenceOnlyInChangeMode();
		}
	},

	handleClickPointSign:function(operation, pointType){
		const score = TeamHelper.operationByType(operation, this.props.plainPoints, pointType, this.props.pointsStep);

		this.props.onChange(score);
	},
	renderPlayerPlainPointsInChangeMode: function() {
		return (
			<PlainPoints	plainPoints	= { this.props.plainPoints }
							step		= { this.props.pointsStep }
							onChange	= { this.props.onChange }
							modeView	= { this.props.modeView }
			/>
		);
	},
	renderPlayerPresenceOnlyInChangeMode: function() {
		return (
			<PresenceOnly
				presence	= { this.props.presence }
				onChange	= { this.props.onChange }
			/>
		);
	},
	renderPlayerTimePointsInChangeMode: function() {
		const mask = this.props.pointsMask ? this.props.pointsMask : ScoreHelper.DEFAULT_TIME_MASK;

		return (
			<MaskedPoints
				plainPoints		= { this.props.plainPoints }
				value			= { ScoreHelper.plainPointsToTimeString(this.props.plainPoints, mask, ':') }
				mask			= { mask }
				onChange		= { this.props.onChange }
				stringToPoints	= { ScoreHelper.stringTimeToPoints.bind(ScoreHelper) }
				validation		= { ScoreHelper.validateStringTime.bind(ScoreHelper) }
				className		= "mTime"
				modeView		= { this.props.modeView }
			/>
		);
	},
	renderPlayerDistancePointsInChangeMode: function() {
		const mask = this.props.pointsMask ? this.props.pointsMask : ScoreHelper.DEFAULT_DISTANCE_MASK;

		return (
			<MaskedPoints
				plainPoints		= { this.props.plainPoints }
				value			= { ScoreHelper.plainPointsToDistanceString(this.props.plainPoints, mask, ':') }
				mask			= { mask }
				onChange		= { this.props.onChange }
				stringToPoints	= { ScoreHelper.stringDistanceToPoints.bind(ScoreHelper) }
				validation		= { ScoreHelper.stringDistanceValidation.bind(ScoreHelper) }
				className		= "mDistance"
				modeView		= { this.props.modeView }
			/>
		);
	},

	render: function () {
		const self = this;

		if(self.props.isChangeMode) {
			return self.renderScoreChangeMode();
		} else {
			return self.renderScoreViewMode();
		}
	}
});

module.exports = Score;


