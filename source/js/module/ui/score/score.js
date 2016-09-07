const	React		= require('react'),
		ScoreSign	= require('./score_sign'),
		SVG			= require('module/ui/svg');

const Score = React.createClass({
	propTypes: {
		isChangeMode:			React.PropTypes.bool,
		plainPoints:			React.PropTypes.number.isRequired,
		pointsType:				React.PropTypes.string.isRequired,
		handleClickPointSign:	React.PropTypes.func.isRequired
	},
	getDefaultProps: function() {
		return {
			isChangeMode: false
		};
	},
	getTimePoints: function(plainPoints) {
		const	hour	= Math.floor(plainPoints / 3600),
				min		= Math.floor((plainPoints - hour * 3600) / 60),
				sec		= plainPoints - hour * 3600 - min * 60;

		return {
			hour:	hour,
			min:	min,
			sec:	sec
		};
	},
	getStringTimePoints: function(plainPoints) {
		const self = this;

		const timePoints = self.getTimePoints(plainPoints);

		if(timePoints.hour === 0 && timePoints.min === 0) {
			return `${timePoints.sec}sec`;
		} else if(timePoints.hour === 0) {
			return `${timePoints.min}min ${timePoints.sec}sec`;
		} else {
			return `${timePoints.hour}h ${timePoints.min}min ${timePoints.sec}sec`;
		}
	},
 	getDistancePoints: function(plainPoints) {
		const	km	= Math.floor(plainPoints / 10000),
				m	= Math.floor((plainPoints - km * 10000) / 100),
				cm	= plainPoints - km * 10000 - m * 100;

		return {
			km:	km,
			m:	m,
			cm:	cm
		}
	},
	getStringDistancePoints: function(plainPoints) {
		const self = this;

		const distancePoints = self.getDistancePoints(plainPoints);

		if(distancePoints.km === 0 && distancePoints.m === 0) {
			return `${distancePoints.cm}cm`;
		} else if(distancePoints.km === 0) {
			return `${distancePoints.m}m ${distancePoints.cm}cm`;
		} else {
			return `${distancePoints.km}km ${distancePoints.m}m ${distancePoints.cm}cm`;
		}
	},
	renderScoreViewMode: function() {
		const self = this;

		let points;

		switch (self.props.pointsType) {
			case 'PLAIN':
				points = self.props.plainPoints;
				break;
			case 'TIME':
				points = self.getStringTimePoints(self.props.plainPoints);
				break;
			case 'DISTANCE':
				points = self.getStringDistancePoints(self.props.plainPoints);
				break;
		}

		return <div className="ePlayer_score">{points}</div>;
	},
	renderScoreChangeMode: function() {
		const self = this;

		// points type
		switch (self.props.pointsType) {
			case 'PLAIN':
				return self.renderPlayerPlainPointsInChangeMode();
			case 'TIME':
				return self.renderPlayerTimePointsInChangeMode();
			case 'DISTANCE':
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

		const timePoints = self.getTimePoints(self.props.plainPoints);

		return (
			<div className="bScore">
				<ScoreSign type="minus" handleClick={self.props.handleClickPointSign.bind(null, 'minus', 'h')}/>
				<div className="eScore_Points">{`${timePoints.hour}h`}</div>
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

		const distancePoints = self.getDistancePoints(self.props.plainPoints);

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


