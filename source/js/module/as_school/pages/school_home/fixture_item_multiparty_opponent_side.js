const 	React				= require('react'),
		propz				= require('propz'),
		DateTimeMixin		= require('module/mixins/datetime'),
		SportHelper 		= require('module/helpers/sport_helper'),
		ChallengeModel		= require('module/ui/challenges/challenge_model'),
		FixtureItemStyle	= require('./../../../../../styles/main/b_school_fixtures.scss');

/**
 * This component is opponent part of fixture item.
 * For default type of sport between two opponents.
 */
const FixtureItemMultipartyOpponentSide = React.createClass({

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
		const imgStyle = {
			backgroundImage: 'url(' + model.rivals[0].schoolPic + ')'
		};

		return (
			<div className="eFixture_item mOpponent">
				<div className="eFixture_item_imgContainer">
					<div className="eFixture_item_img" style={imgStyle}/>
				</div>
				<div className="eFixture_item mSchoolName">{this.cropOpponentName(model.rivals[0].value)}</div>
			</div>
		);
	},

	renderRightOpponentSide: function (event, model) {
		const imgStyle = {
			backgroundImage: 'url(' + model.rivals[1].schoolPic + ')'
		};
		return (
			<div className="eFixture_item mOpponent">
				<div className="eFixture_item_imgContainer">
					<div className="eFixture_item_img" style={imgStyle}/>
				</div>
				<div className="eFixture_item mSchoolName">{this.cropOpponentName(model.rivals[1].value)}</div>
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
			<div className="eFixture_rightSide">
				{this.renderLeftOpponentSide(event, challengeModel)}
				{challengeModel.textResult}
			</div>
		)
	}
});

module.exports = FixtureItemMultipartyOpponentSide;