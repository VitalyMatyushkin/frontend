/**
 * Created by Anatoly on 22.09.2016.
 */

const 	React 			= require('react'),
		Sport           = require('module/ui/icons/sport_icon'),
		classNames      = require('classnames'),
		ChallengeModel  = require('module/ui/challenges/challenge_model');

const FixtureItem = React.createClass({
	propTypes: {
		event			: React.PropTypes.object.isRequired,
		activeSchoolId	: React.PropTypes.string,
		onClick			: React.PropTypes.func
	},
	getActiveSchoolId: function() {
		if(typeof this.props.event.child !== "undefined") {
			return this.props.event.child.schoolId;
		} else {
			return this.props.activeSchoolId;
		}
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
		if(typeof this.props.onClick === "function") {
			this.props.onClick(this.props.event.id, this.getActiveSchoolId());
		}
		e.stopPropagation();
	},
	render: function () {
		const	event			= this.props.event,
				model			= new ChallengeModel(event, this.getActiveSchoolId()),
				scoreClasses	= classNames({eChallenge_results: true, mDone: model.isFinished}),
				isCancelled		= event.status === 'CANCELED',
				isRejected		= event.status === 'REJECTED',
				isInvitesSent	= event.status === 'INVITES_SENT',
				isInactive		= isCancelled || isRejected,
				topClassName	= 'bChallenge ' + (isInactive ? 'mInactive' : ''),
				iconClassName	= 'bIcon_invites ' + (isInactive ? 'mInactive' : ''),
				sportIcon		= <Sport name={model.sport} className={iconClassName}/>;

		let eventResult;

		// TODO: I'm not sure it should be here. Models as they are implemented sucks, but they hide that kind of code
		switch (true) {
			case isCancelled:
				eventResult = 'Cancelled';
				break;
			case isRejected:
				eventResult = 'Rejected';
				break;
			case isInvitesSent:
				eventResult = <span>Awaiting<br/>opponent</span>;
				break;
			case typeof model.textResult === 'undefined':
				eventResult = model.score;
				break;
			default:
				eventResult = <span>{model.textResult}<br/>{model.score}</span>
		}

		return (
			<div className={topClassName} onClick={(e) => !isInactive ? this.onClickChallenge(e) : undefined}>
				<div className="eChallenge_hours">{model.time}</div>
				<div className="eChallenge_sport">{sportIcon}</div>
				<div className="eChallenge_event" title={model.name}>{model.name}</div>
				{this.renderGameTypeColumn(model)}
				<div className={scoreClasses}>{eventResult}</div>
			</div>
		);
	}
});

module.exports = FixtureItem;