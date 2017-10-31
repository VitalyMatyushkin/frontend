/**
 * Created by vitaly on 30.10.17.
 */
const	React			= require('react'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		ChallengeModel	= require('module/ui/challenges/challenge_model');

const InterSchoolsResults = React.createClass({
	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	render: function() {
		const	event		= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId),
				rightSideClasses = "";
		let text;
		if (
			challengeModel.isFinished &&
			event.inviterSchool.id === activeSchoolId &&
			event.inviterSchool.kind === 'SchoolUnion' ||
			challengeModel.isFinished && TeamHelper.isNonTeamSport(event)
		) {
			text = 'Multiple result';
		} else {
			text = challengeModel.textResult;
		}

		return (
			<div className="eEventResultView_bodyRightSide">
				<div className="eEventResultView_score">
				</div>
				<div className="eEventResultView_mainInfoBlock mRight">
					<div className={rightSideClasses}>{text}</div>
				</div>
			</div>
		)
	}
});

module.exports = InterSchoolsResults;