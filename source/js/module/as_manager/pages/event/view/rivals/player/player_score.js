const	React		= require('react'),
		Score		= require('module/ui/score/score'),
		EventHelper	= require('module/helpers/eventHelper');

const PlayerScore = React.createClass({
	propTypes: {
		player						: React.PropTypes.object.isRequired,
		event						: React.PropTypes.object.isRequired,
		mode						: React.PropTypes.string.isRequired,
		teamId						: React.PropTypes.string.isRequired,
		isOwner						: React.PropTypes.bool.isRequired,
		individualScoreAvailable	: React.PropTypes.bool.isRequired,
		onChange					: React.PropTypes.func.isRequired
	},
	getPointsByStudent: function(event, userId) {
		const userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);

		return  userScoreDataIndex === -1 ? 0 : event.results.individualScore[userScoreDataIndex].score;
	},
	render: function() {
		const	event						= this.props.event,
				player						= this.props.player,
				teamId						= this.props.teamId,
				mode						= this.props.mode,
				isOwner						= this.props.isOwner,
				individualScoreAvailable	= this.props.individualScoreAvailable;

		//onChange		= {this.handleChangeScore.bind(this, event, teamId, player)}
		return (
			<span className="ePlayer_scoreContainer">
				<Score	isChangeMode	= {EventHelper.isShowScoreButtons(event, mode, isOwner, individualScoreAvailable)}
						plainPoints		= {this.getPointsByStudent(event, player.userId)}
						pointsStep		= {event.sport.points.pointsStep}
						pointsType		= {event.sport.points.display}
						pointsMask		= {event.sport.points.inputMask}
						onChange		= {this.props.onChange}
				/>
			</span>
		);
	}
});

module.exports = PlayerScore;