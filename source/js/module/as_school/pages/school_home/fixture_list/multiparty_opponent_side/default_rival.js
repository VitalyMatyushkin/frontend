const	React				= require('react'),
		ChallengeModel		= require('module/ui/challenges/challenge_model'),
		FixtureRivalStyle	= require('../../../../../../../styles/ui/b_fixture_rival/b_fixture_rival.scss');

const DefaultRival = React.createClass({
	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	render: function() {
		const	event			= this.props.event,
			activeSchoolId	= this.props.activeSchoolId,
			challengeModel	= new ChallengeModel(event, activeSchoolId, undefined, true);

		const rivalLogoStyle = {
				backgroundImage: 'url(' + challengeModel.rivals[0].schoolPic + ')'
			};

		return (
			<div className="bFixtureRival">
				<div className="eFixtureRival_rivalLogoContainer mDefaultRival">
					<div
						className	= "eFixtureRival_rivalLogo"
						style		= { rivalLogoStyle }
					>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = DefaultRival;