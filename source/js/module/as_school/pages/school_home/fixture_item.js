/**
 * Created by wert on 06.09.16.
 */

const 	React 			= require('react'),
		DateTimeMixin	= require('module/mixins/datetime'),
		EventHelper		= require('module/helpers/eventHelper'),
		SportIcon		= require('module/ui/icons/sport_icon'),
		ChallengeModel	= require('module/ui/challenges/challenge_model');

const FixtureItem = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},

	getFixtureInfo: function(event) {
		return(
			<div>
				<div className="bFix_date">{`${this.getDateFromIso(event.startTime)} ${this.getTimeFromIso(event.startTime)}`}</div>
				<div className="bFix_name">{event.name}</div>
				<div className="bFix_type">{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}</div>
			</div>
		)
	},

	renderLeftOpponentSide: function (event, model) {

		return (
			<div className="bFixtureOpponent bFixture_item no-margin">
				<div>
					<img src={model.rivals[0].schoolPic}/>
					<span>{model.rivals[0].value}</span>
				</div>
			</div>
		);
	},

	renderRightOpponentSide: function (event, model) {

		return (
			<div className="bFixtureOpponent bFixture_item no-margin">
				<div>
					<img src={model.rivals[1].schoolPic}/>
					<span>{model.rivals[1].value}</span>
				</div>
			</div>
		);
	},

	render: function() {
		const 	event 			= this.props.event,
				sportName		= event.sport.name,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId);

		return (
			<div className="bFixtureContainer">
				<div className="bFixtureIcon bFixture_item">
					<SportIcon name={sportName || ''} className="bIcon_mSport" />
				</div>
				<div className="bFixtureInfo bFixture_item">
					{this.getFixtureInfo(event)}
				</div>
				{this.renderLeftOpponentSide(event, challengeModel)}
				<div className="bFixtureResult bFixture_item no-margin">
					<div>
						<div className="bFix_scoreText">{'Score'}</div>
						<div className="bFix_scoreResult">{`${challengeModel.score}`}</div>
					</div>
				</div>
				{this.renderRightOpponentSide(event, challengeModel)}
			</div>
		)
	}
});

module.exports = FixtureItem;