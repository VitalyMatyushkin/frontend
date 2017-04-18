const	React			= require('react'),
		Score			= require('module/ui/score/score'),
		ScoreCricket	= require('module/ui/score/score_cricket'),
		RivalHelper		= require('module/as_manager/pages/event/view/rivals/rival_helper');

const PlayerScore = React.createClass({
	propTypes: {
		player						: React.PropTypes.object.isRequired,
		event						: React.PropTypes.object.isRequired,
		mode						: React.PropTypes.string.isRequired,
		isOwner						: React.PropTypes.bool.isRequired,
		individualScoreAvailable	: React.PropTypes.bool.isRequired,
		onChange					: React.PropTypes.func.isRequired
	},
	getPointsByStudent: function(event, userId) {
		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		return  userScoreDataIndex === -1 ? 0 : event.results.individualScore[userScoreDataIndex].score;
	},
	onChange: function(scoreData) {
		this.props.onChange(scoreData, this.props.player);
	},
	render: function() {
		const	event						= this.props.event,
				player						= this.props.player,
				mode						= this.props.mode,
				isOwner						= this.props.isOwner,
				individualScoreAvailable	= this.props.individualScoreAvailable;
		
		if (event.sport.name.toLowerCase() === 'cricket') {
			return (
				<div className="ePlayer_scoreCricketContainer">
					<ScoreCricket	isChangeMode	= {RivalHelper.isShowScoreButtons(event, mode, isOwner) && individualScoreAvailable}
									plainPoints		= {this.getPointsByStudent(event, player.userId)}
									pointsStep		= {event.sport.points.pointsStep}
									pointsType		= {event.sport.points.display}
									pointsMask		= {event.sport.points.inputMask}
									onChange		= {this.onChange}
					/>
				</div>
			);
		} else {
			return (
				<span className="ePlayer_scoreContainer">
					<Score	isChangeMode	= {RivalHelper.isShowScoreButtons(event, mode, isOwner) && individualScoreAvailable}
							plainPoints		= {this.getPointsByStudent(event, player.userId)}
							pointsStep		= {event.sport.points.pointsStep}
							pointsType		= {event.sport.points.display}
							pointsMask		= {event.sport.points.inputMask}
							onChange		= {this.onChange}
					/>
				</span>
			);
		}
	}
});

module.exports = PlayerScore;