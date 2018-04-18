const	React				= require('react'),
		{ChallengeModel}	= require('module/ui/challenges/challenge_model'),
		FixtureRivalStyle	= require('../../../../../../../styles/ui/b_fixture_rival/b_fixture_rival.scss');

const InterSchoolsRival = React.createClass({
	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	// it's old anatoly fucking creation
	cropOpponentName: function(name) {
		if (name == null) {
			return '';
		}

		var maxLength = 40;
		if (name.length > maxLength) {
			name = name.substr(0, maxLength-3) + "...";
		}
		return name;
	},
	render: function() {
		const	event			= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId, undefined, true);

		const	rivalLogoStyle	= {
					backgroundImage: 'url(' + challengeModel.rivals[0].schoolPic + ')'
				},
				rivalName		= this.cropOpponentName(challengeModel.rivals[0].value);

		return (
			<div className="bFixtureRival">
				<div className="eFixtureRival_rivalLogoContainer">
					<div
						className	= "eFixtureRival_rivalLogo"
						style		= { rivalLogoStyle }
					>
					</div>
				</div>
				<div className="eFixtureRival_rivalName">
					{ rivalName }
				</div>
			</div>
		);
	}
});

module.exports = InterSchoolsRival;