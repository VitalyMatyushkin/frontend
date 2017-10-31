/**
 * Created by vitaly on 30.10.17.
 */

const 	React				= require('react'),
		propz				= require('propz'),
		DateTimeMixin		= require('module/mixins/datetime'),
		SportHelper 		= require('module/helpers/sport_helper'),
		ChallengeModel		= require('module/ui/challenges/challenge_model');

/**
 * This component is opponent part of fixture item.
 * For default type of sport between two opponents.
 */
const FixtureItemTwoTeamOpponentSide = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	cropOpponentName: function(name) {
		if (name == null)
			return;
		var maxLength = 40;
		if (name.length > maxLength) {
			name = name.substr(0,maxLength-3) + "...";
		}
		return name;
	},
	renderLeftOpponentSide: function (event, model) {
		const 	leftSideClasses = model.rivals[0].value.replace(/\s+/g, ' ').length > 25 ? "mSmall" : "";

		return (
			<div className="eEventResultView_bodyLeftSide">
				<div className="eEventResultView_mainInfoBlock">
					<div className={leftSideClasses}>{ this.cropOpponentName(model.rivals[0].value) }</div>
				</div>
				<div className="eEventResultView_score mRight">
					{ model.scoreAr[0] }
				</div>
			</div>
		);
	},

	renderRightOpponentSide: function (event, model) {
		const 	rightSideClasses = model.rivals[1].value.replace(/\s+/g, ' ').length > 25 ? "mSmall" : "";

		return (
			<div className="eEventResultView_bodyRightSide">
				<div className="eEventResultView_score">
					{ model.scoreAr[1] }
				</div>
				<div className="eEventResultView_mainInfoBlock mRight">
					<div className={rightSideClasses}>{ this.cropOpponentName(model.rivals[1].value) }</div>
				</div>
			</div>
		);

	},

	render: function() {
		const	event				= this.props.event,
			activeSchoolId		= this.props.activeSchoolId,
			challengeModel		= new ChallengeModel(event, activeSchoolId),
			isAwaitingOpponent	= event.status === 'INVITES_SENT',
			score				= SportHelper.isCricket(challengeModel.sport) ? challengeModel.textResult : challengeModel.score,
			scoreText			= SportHelper.isCricket(challengeModel.sport) ? '' : 'Score';

		return (
			<div className="bEventResultView">
				{this.renderLeftOpponentSide(event, challengeModel)}
				<span className="eSeparator"></span>
				{this.renderRightOpponentSide(event, challengeModel)}
			</div>
		)
	}
});

module.exports = FixtureItemTwoTeamOpponentSide;