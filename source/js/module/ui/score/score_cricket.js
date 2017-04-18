/**
 * Created by Woland on 17.04.2017.
 */
const	React			= require('react'),

		classNames		= require('classnames'),

		TeamHelper  	= require('module/ui/managers/helpers/team_helper'),
		SportConsts		= require('module/helpers/consts/sport'),
		ScoreHelper 	= require('./score_helper'),
		CricketPoints 	= require('./cricket-points'),
		MaskedPoints 	= require('./masked-points'),
		ScoreConsts		= require('./score_consts');

const Score = React.createClass({
	propTypes: {
		isChangeMode:	React.PropTypes.bool,
		plainPoints:	React.PropTypes.number.isRequired,
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
		const playerScoreClassName = classNames({
			"ePlayer_score":	true,
			"mMedium":			this.props.modeView === ScoreConsts.SCORE_MODES_VIEW.BIG
		});
		
		const 	runs 	= TeamHelper.convertPointsCricket(this.props.plainPoints).runs,
				wickets = TeamHelper.convertPointsCricket(this.props.plainPoints).wickets;
		
		return (
			<div className={playerScoreClassName}>
				<span>{`Runs ${runs}`}</span>
				<span>{` / `}</span>
				<span>{`Wikets ${wickets}`}</span>
			</div>
		);
	},
	
	renderScoreCricketChangeMode: function() {
		return (
			<CricketPoints	plainPoints	= { this.props.plainPoints }
							step		= { this.props.pointsStep }
							onChange	= { this.props.onChange }
							modeView	= { this.props.modeView }
			/>
		);
	},
	
	render: function () {
		if(this.props.isChangeMode) {
			return this.renderScoreCricketChangeMode();
		} else {
			return this.renderScoreViewMode();
		}
	}
});

module.exports = Score;


