const	React			= require('react'),
		propz 			= require('propz'),
		Score			= require('module/ui/score/score'),
		ScoreCricket	= require('module/ui/score/score_cricket'),
		ScoreAthletic	= require('module/ui/score/score_athletic'),
		SportHelper 	= require('module/helpers/sport_helper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
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
	
	getAthleticExtraPointsByStudent: function(event, userId) {
		const 	userScoreDataIndex = event.results.individualScore.findIndex(userScoreData => userScoreData.userId === userId);
		
		if (userScoreDataIndex === -1) {
			return 0;
		} else {
			const extraScore = propz.get(event, ['results', 'individualScore', userScoreDataIndex, 'richScore', 'extraScore']);
			if (typeof extraScore !== 'undefined') {
				return  extraScore;
			} else {
				return 0;
			}
		}
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

		//For cricket we use separate component (because cricket no usual game, with very strange rules)
		//We save score in format {number}: <Runs>999.<Wickets>9 (example 200.5, mean Runs: 200, Wickets: 5)
		if (SportHelper.isCricket(event.sport.name)) {
			return (
				<div className="ePlayer_scoreCricketContainer">
					<ScoreCricket	isChangeMode	= { RivalHelper.isShowScoreButtons(event, mode, isOwner) && individualScoreAvailable }
									plainPoints		= { this.getPointsByStudent(event, player.userId) }
									pointsStep		= { event.sport.points.pointsStep }
									onChange		= { this.onChange }
									isPlayerScore 	= { true }
					/>
				</div>
			);
		} else if (TeamHelper.isInterSchoolsEventForIndividualSport(event)) {
			return (
				<span className="ePlayer_scoreAthleticContainer">
					<ScoreAthletic	isChangeMode			= { RivalHelper.isShowScoreButtons(event, mode, isOwner) && individualScoreAvailable }
									plainPoints				= { this.getPointsByStudent(event, player.userId) }
									plainExtraPoints 		= { this.getAthleticExtraPointsByStudent(event, player.userId) }
									pointsType				= { event.sport.points.display }
									pointsStep				= { event.sport.points.pointsStep }
									onChangeScoreAthletic	= { this.onChange }
									pointsMask				= { event.sport.points.inputMask }
					/>
				</span>
			)
		} else {
			return (
				<span className="ePlayer_scoreContainer">
					<Score	isChangeMode	= { RivalHelper.isShowScoreButtons(event, mode, isOwner) && individualScoreAvailable }
							plainPoints		= { this.getPointsByStudent(event, player.userId) }
							pointsStep		= { event.sport.points.pointsStep }
							pointsType		= { event.sport.points.display }
							pointsMask		= { event.sport.points.inputMask }
							onChange		= { this.onChange }
					/>
				</span>
			);
		}
	}
});

module.exports = PlayerScore;