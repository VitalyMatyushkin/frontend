const	React			= require('react'),
		TeamHelper  	= require('module/ui/managers/helpers/team_helper'),
		SportConsts		= require('module/helpers/consts/sport'),
		ScoreHelper 	= require('./score_helper'),
		PlainPoints 	= require('./plain-points'),
		MaskedPoints 	= require('./masked-points');

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
		return <MaskedPoints 	plainPoints={this.props.plainPoints}
						   		mask={this.props.pointsMask}
						   		onChange={this.props.onChange}
								stringToPoints={ScoreHelper.stringTimeToPoints}
								validation={ScoreHelper.stringTimeValidation}
								className="mTime"
		/>;
	},
	renderPlayerDistancePointsInChangeMode: function() {
		return <MaskedPoints 	plainPoints={this.props.plainPoints}
								mask={this.props.pointsMask}
								onChange={this.props.onChange}
								stringToPoints={ScoreHelper.stringDistanceToPoints}
								validation={ScoreHelper.stringDistanceValidation}
								className="mDistance"
		/>;
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


