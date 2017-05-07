const	React								= require('react'),
		ChallengeModel						= require('module/ui/challenges/challenge_model'),
		MultipartyInterSchoolsResultsStyle	= require('./../../../../../../../styles/ui/b_multiparty_interSchools_results/b_multiparty_interSchools_results.scss'),
		FixtureItemStyle					= require('./../../../../../../../styles/main/b_school_fixtures.scss');

const InterSchoolsResults = React.createClass({
	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	render: function() {
		const	event		= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId);

		let text;

		switch (event.status) {
			case 'FINISHED':
				text = challengeModel.textResult;
				break;
			default:
				text = 'Click here for more details';
				break;
		}

		return (
			<div className="bMultipartyInterSchoolsResults">
				{text}
			</div>
		)
	}
});

module.exports = InterSchoolsResults;