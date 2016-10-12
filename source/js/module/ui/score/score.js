const	React		= require('react'),
		ScoreSign	= require('./score_sign'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper'),
		SportConsts	= require('module/helpers/consts/sport'),
		SVG			= require('module/ui/svg');

const Score = React.createClass({
	propTypes: {
		isChangeMode:			React.PropTypes.bool,
		plainPoints:			React.PropTypes.number.isRequired,
		pointsStep:				React.PropTypes.number.isRequired,
		pointsType:				React.PropTypes.string.isRequired,
		handleClickPointSign:	React.PropTypes.func.isRequired
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

	renderPlayerPlainPointsInChangeMode: function() {
		const self = this;

		return (
			<div className="bScore">
				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'plain')}/>
				<div className="eScore_Points">{self.props.plainPoints}</div>
				<ScoreSign type="plus" handleClick={self.props.handleClickPointSign.bind(null, 'plus', 'plain')}/>
			</div>
		);
	},
	renderPlayerTimePointsInChangeMode: function() {
		const self = this;

		const timePoints = TeamHelper.convertPoints(this.props.plainPoints);

		return (
			<div className="bScore">
				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'h')}/>
				<div className="eScore_Points">{`${timePoints.h}h`}</div>
				<ScoreSign type="plus" handleClick={self.props.handleClickPointSign.bind(null, 'plus', 'h')}/>

				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'min')}/>
				<div className="eScore_Points">{`${timePoints.min}min`}</div>
				<ScoreSign type="plus" handleClick={self.props.handleClickPointSign.bind(null, 'plus', 'min')}/>

				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'sec')}/>
				<div className="eScore_Points">{`${timePoints.sec}sec`}</div>
				<ScoreSign type="plus" handleClick={self.props.handleClickPointSign.bind(null, 'plus', 'sec')}/>
			</div>
		);
	},
	renderPlayerDistancePointsInChangeMode: function() {
		const self = this;

		const distancePoints = TeamHelper.convertPoints(this.props.plainPoints, this.props.pointsType);

		return (
			<div className="bScore">
				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'km')}/>
				<div className="eScore_Points">{`${distancePoints.km}km`}</div>
				<ScoreSign type="plus" handleClick={self.props.handleClickPointSign.bind(null, 'plus', 'km')}/>

				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'm')}/>
				<div className="eScore_Points">{`${distancePoints.m}m`}</div>
				<ScoreSign type="plus" handleClick={self.props.handleClickPointSign.bind(null, 'plus', 'm')}/>

				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'cm')}/>
				<div className="eScore_Points">{`${distancePoints.cm}cm`}</div>
				<ScoreSign type="plus" handleClick={self.props.handleClickPointSign.bind(null, 'plus', 'cm')}/>
			</div>
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


