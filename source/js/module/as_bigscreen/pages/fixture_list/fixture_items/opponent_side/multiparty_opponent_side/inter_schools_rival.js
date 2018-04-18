/**
 * Created by vitaly on 30.10.17.
 */
const	React				= require('react'),
		{ChallengeModel}	= require('module/ui/challenges/challenge_model');

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
				challengeModel	= new ChallengeModel(event, activeSchoolId);

		const	leftSideClasses = challengeModel.rivals[0].value.replace(/\s+/g, ' ').length > 25 ? "mSmall" : "",
				rivalName		= this.cropOpponentName(challengeModel.rivals[0].value);

		return (
			<div className="eEventResultView_bodyLeftSide">
				<div className="eEventResultView_mainInfoBlock">
					<div className={leftSideClasses}>{ rivalName }</div>
				</div>
				<div className="eEventResultView_score mRight">
				</div>
			</div>
		);
	}
});

module.exports = InterSchoolsRival;