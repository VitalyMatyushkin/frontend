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
		activeSchoolId	: React.PropTypes.string.isRequired,
		onClick			: React.PropTypes.func
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
			// if child isn't undefined, then it's parent fixture
			// and we must add schoolId for fixture item click handler
			if(typeof this.props.event.child !== "undefined") {
				this.props.onClick(this.props.event.id, this.props.event.child.schoolId);
			} else {
				//we need in activeSchoolId in student access, i dont know how distinguish student and no-student events
				this.props.onClick(this.props.event.id, this.props.activeSchoolId);
			}
		}
		e.stopPropagation();
	},
	render: function () {
		const	event			= this.props.event,
				model			= new ChallengeModel(event, this.props.activeSchoolId),
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