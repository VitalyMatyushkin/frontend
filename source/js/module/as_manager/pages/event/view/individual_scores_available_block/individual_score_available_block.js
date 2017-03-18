const	React 								= require('react'),
		If									= require('module/ui/if/if'),
		IndividualScoreAvailable			= require('./individual_score_available'),
		IndividualScoreAvailableBlockHelper	= require('./helpers/individual_score_available_block_helper');

const EditingTeamsButtons = React.createClass({
	propTypes: {
		binding:		React.PropTypes.object.isRequired,

		activeSchoolId:	React.PropTypes.string.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired
	},
	render:function () {
		let result = null;
		if(this.props.mode === 'closing') {
			const isShowIndividualScoresAvailableFlagArray = [
				IndividualScoreAvailableBlockHelper.isShowIndividualScoresAvailableFlagByOrder(
					this.props.activeSchoolId,
					this.props.event,
					0
				),
				IndividualScoreAvailableBlockHelper.isShowIndividualScoresAvailableFlagByOrder(
					this.props.activeSchoolId,
					this.props.event,
					1
				)
			];

			if(isShowIndividualScoresAvailableFlagArray[0] || isShowIndividualScoresAvailableFlagArray[1]) {
				result = (
					<div className="bEventMiddleSideContainer">
						<div className="bEventMiddleSideContainer_row">
							<div className="col-md-5 col-md-offset-1 col-sm-6">
								<If condition={isShowIndividualScoresAvailableFlagArray[0]}>
									<IndividualScoreAvailable binding={this.props.binding.sub(`individualScoreAvailable.0`)}/>
								</If>
							</div>
							<div className="col-md-5 col-sm-6">
								<If condition={isShowIndividualScoresAvailableFlagArray[1]}>
									<IndividualScoreAvailable binding={this.props.binding.sub(`individualScoreAvailable.1`)}/>
								</If>
							</div>
						</div>
					</div>
				);
			}
		}

		return result;
	}
});

module.exports = EditingTeamsButtons;