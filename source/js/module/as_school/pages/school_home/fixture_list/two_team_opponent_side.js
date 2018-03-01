const 	React           = require('react'),
		DateTimeMixin   = require('module/mixins/datetime'),
		SportHelper     = require('module/helpers/sport_helper'),
		ChallengeModel  = require('module/ui/challenges/challenge_model');

const FixtureItemStyle	= require('./../../../../../../styles/main/b_school_fixtures.scss');

/**
 * This component is opponent part of fixture item.
 * For default type of sport between two opponents.
 */
const FixtureItemTwoTeamOpponentSide = React.createClass({
	mixins: [DateTimeMixin],
	propTypes: {
		event: React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getActiveSchoolSettingsFromEvent: function () {
		return this.props.event.settings.find(s => s.schoolId === this.props.activeSchoolId);
	},
	getScoreText: function (challengeModel) {
		const settings = this.getActiveSchoolSettingsFromEvent();
		let isDisplayResultsOnPublic = typeof settings !== 'undefined' ? settings.isDisplayResultsOnPublic : true;
		const isAwaitingOpponent = this.props.event.status === 'INVITES_SENT';

		let text;
		switch (true) {
			case isAwaitingOpponent: {
				text = 'Awaiting opponent';
				break;
			}
			case !isDisplayResultsOnPublic: {
				text = '';
				break;
			}
			case SportHelper.isCricket(challengeModel.sport): {
				text = '';
				break;
			}
			default: {
				text = 'Score';
				break;
			}
		}

		return text;
	},
	getScore: function (challengeModel) {
		const isAwaitingOpponent = this.props.event.status === 'INVITES_SENT';

		let text;
		switch (true) {
			case isAwaitingOpponent: {
				text = '';
				break;
			}
			default: {
				text = SportHelper.isCricket(challengeModel.sport) ? challengeModel.textResult : challengeModel.score;
				break;
			}
		}

		return text;
	},
	cropOpponentName: function(name) {
		if (name == null) {
			return;
		}

		const maxLength = 40;
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
		const event = this.props.event;
		const challengeModel = new ChallengeModel(event, this.props.activeSchoolId, undefined, true);

		return (
			<div className="eFixture_rightSide">
				{this.renderLeftOpponentSide(event, challengeModel)}
				<div className="eFixture_item mResult">
					<div>
						<div className="bFix_scoreText">{this.getScoreText(challengeModel)}</div>
						<div className="bFix_scoreResult">{this.getScore(challengeModel)}</div>
					</div>
				</div>
				{this.renderRightOpponentSide(event, challengeModel)}
			</div>
		)
	}
});

module.exports = FixtureItemTwoTeamOpponentSide;