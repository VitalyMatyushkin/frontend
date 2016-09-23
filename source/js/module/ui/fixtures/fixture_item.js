/**
 * Created by Anatoly on 22.09.2016.
 */

const 	React 			= require('react'),
		Sport           = require('module/ui/icons/sport_icon'),
		classNames      = require('classnames'),
		ChallengeModel  = require('module/ui/challenges/challenge_model');

const FixtureItem = React.createClass({
	propTypes: {
		event: React.PropTypes.object.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func
	},
	/**
	 * Render game type column
	 * @param {ChallengeModel} model - ChallengeModel object
	 * @returns {function} - React component of Game Type
	 * */
	renderGameTypeColumn: function (model) {
		const leftSideRivalName = model.rivals[0].value,
			rightSideRivalName = model.rivals[1].value;

		if (model.isIndividualSport) {
			return (
				<div className="eChallenge_rivals">
					{"Individual Game"}
				</div>
			);
		}

		return (
			<div className="eChallenge_rivals">
				<span className="eChallenge_rivalName" title={leftSideRivalName}>{leftSideRivalName}</span>
				<span>vs</span>
				<span className="eChallenge_rivalName" title={rightSideRivalName}>{rightSideRivalName}</span>
			</div>
		);
	},
	onClickChallenge: function (e) {
		this.props.onClick && this.props.onClick(this.props.event.id);
		e.stopPropagation();
	},
	render: function () {
		const model = new ChallengeModel(this.props.event, this.props.activeSchoolId),
			sportIcon = <Sport name={model.sport} className="bIcon_invites"/>,
			scoreClasses = classNames({eChallenge_results: true, mDone: model.isFinished});

		return (
			<div className="bChallenge" onClick={this.onClickChallenge}>
				<div className="eChallenge_hours">{model.time}</div>
				<div className="eChallenge_sport">{sportIcon}</div>
				<div className="eChallenge_event" title={model.name}>{model.name}</div>
				{this.renderGameTypeColumn(model)}
				<div className={scoreClasses}>{model.score}</div>
			</div>
		);
	}
});

module.exports = FixtureItem;