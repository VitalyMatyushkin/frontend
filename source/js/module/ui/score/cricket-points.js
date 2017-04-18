/**
 * Created by Woland on 17.04.2017.
 */

const 	React 			= require('react'),
		ScoreSign		= require('./score_sign'),
		TeamHelper  	= require('module/ui/managers/helpers/team_helper'),
		ScoreHelper 	= require('./score_helper'),
		classNames 		= require('classnames'),
		CricketPoint 	= require('./cricket-point'),
	
		ScoreConsts	= require('./score_consts');

const CricketPoints = React.createClass({
	
	propTypes:{
		plainPoints:	React.PropTypes.number.isRequired,
		step:			React.PropTypes.number.isRequired,
		onChange: 		React.PropTypes.func.isRequired,
		modeView:		React.PropTypes.string
	},
	
	render: function(){
		const 	runs 		= Math.floor(this.props.plainPoints),
				wickets 	= Math.round(this.props.plainPoints * 10) % 10;
		
		const eScoreCricketWrapper = classNames({
			eScoreCricketWrapper: 	true,
			mTeam:					this.props.modeView === ScoreConsts.SCORE_MODES_VIEW.BIG
		});
		
		return (
			<div className={eScoreCricketWrapper}>
				<CricketPoint
					initialPoints 	= { wickets }
					plainPoints		= { runs }
					step			= { this.props.step }
					onChange		= { this.props.onChange }
					modeView		= { this.props.modeView }
					type 			= { 'Runs' }
				/>
				<CricketPoint
					initialPoints 	= { runs }
					plainPoints		= { wickets }
					step			= { this.props.step }
					onChange		= { this.props.onChange }
					modeView		= { this.props.modeView }
					type 			= { 'Wickets' }
				/>
			</div>
		)
	}
});

module.exports = CricketPoints;
