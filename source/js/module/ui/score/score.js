const	React			= require('react'),
		ScoreSign		= require('./score_sign'),
		TeamHelper  	= require('module/ui/managers/helpers/team_helper'),
		SportConsts		= require('module/helpers/consts/sport'),
		If 				= require('module/ui/if/if'),
		PlainPoints 	= require('./plain-points'),
		TimePoints 		= require('./time-points'),
		DistancePoints 	= require('./distance-points');

const Score = React.createClass({
	propTypes: {
		isChangeMode:	React.PropTypes.bool,
		plainPoints:	React.PropTypes.number.isRequired,
		pointsType:		React.PropTypes.string.isRequired,
		pointsStep:		React.PropTypes.number,
		pointsMask:		React.PropTypes.string,
		onChange:		React.PropTypes.func.isRequired
	},
	getDefaultProps: function() {
		return {
			isChangeMode: false
		};
	},

	renderScoreViewMode: function() {
		return (
			<div className="ePlayer_score">
				{TeamHelper.convertPoints(this.props.plainPoints, this.props.pointsType).str}
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
		}
	},

	handleClickPointSign:function(operation, pointType){
		const score = TeamHelper.operationByType(operation, this.props.plainPoints, pointType, this.props.pointsStep);

		this.props.onChange(score);
	},
	renderPlayerPlainPointsInChangeMode: function() {
		return <PlainPoints value={this.props.plainPoints}
							step={this.props.pointsStep}
							onChange={this.props.onChange} />;
	},
	renderPlayerTimePointsInChangeMode: function() {
		return <TimePoints value={this.props.plainPoints}
						   mask={this.props.pointsMask}
						   onChange={this.props.onChange} />;
	},
	renderPlayerDistancePointsInChangeMode: function() {
		return <DistancePoints 	value={this.props.plainPoints}
								mask={this.props.pointsMask}
								onChange={this.props.onChange} />;
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


