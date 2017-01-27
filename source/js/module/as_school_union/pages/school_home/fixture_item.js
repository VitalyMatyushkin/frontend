/**
 * Created by wert on 06.09.16.
 */

const 	React				= require('react'),
		propz				= require('propz'),
		DateTimeMixin		= require('module/mixins/datetime'),
		EventHelper			= require('module/helpers/eventHelper'),
		SportIcon			= require('module/ui/icons/sport_icon'),
		ChallengeModel		= require('module/ui/challenges/challenge_model'),
		FixtureItemStyle	= require('./../../../../../styles/main/b_school_fixtures.scss');

const FixtureItem = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	handleClickFixtureItem: function() {
		document.location.hash = `event/${this.props.event.id}`;
	},
	getFixtureInfo: function(event) {
		const eventName = propz.get(event, ['generatedNames', this.props.activeSchoolId]) || propz.get(event, ['generatedNames', 'official']);
		return(
			<div>
				<div className="bFix_date">{`${this.getDateFromIso(event.startTime)} ${this.getTimeFromIso(event.startTime)}`}</div>
				<div className="bFix_name">{eventName}</div>
				<div className="bFix_type">{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}</div>
			</div>
		)
	},

	renderLeftOpponentSide: function (event, model) {
		const imgStyle = {
			backgroundImage: 'url(' + model.rivals[0].schoolPic + ')'
		};

		return (
			<div className="eFixture_item mOpponent">
				<div className="eFixture_item_imgContainer">
					<div className="eFixture_item_img" style={imgStyle}/>
				</div>
				<span>{model.rivals[0].value}</span>
			</div>
		);
	},

	renderRightOpponentSide: function (event, model) {
		const imgStyle = {
			backgroundImage: 'url(' + model.rivals[1].schoolPic + ')'
		};
		return (
			<div className="eFixture_item mOpponent">
				<div className="eFixture_item_imgContainer">
					<div className="eFixture_item_img" style={imgStyle}/>
				</div>
				<span>{model.rivals[1].value}</span>
			</div>
		);
	},

	render: function() {
		const 	event 				= this.props.event,
				sportName			= event.sport.name,
				activeSchoolId		= this.props.activeSchoolId,
				challengeModel		= new ChallengeModel(event, activeSchoolId),
				isAwaitingOpponent	= event.status === 'INVITES_SENT';

		return (
			<div className="bFixtureContainer">
				<div className="eFixture_row">
					<div className="eFixture_content" onClick={ this.handleClickFixtureItem }>
						<div className="eFixture_leftSide">
							<div className="eFixture_item mSport">
								<SportIcon name={sportName || ''} className="bIcon_mSport"/>
							</div>
							<div className="eFixture_item mInfo">
								{this.getFixtureInfo(event)}
							</div>
						</div>
						<div className="eFixture_rightSide">
							{this.renderLeftOpponentSide(event, challengeModel)}
							<div className="eFixture_item mResult">
								<div>
									<div className="bFix_scoreText">{isAwaitingOpponent ? 'Awaiting opponent' : 'Score'}</div>
									<div className="bFix_scoreResult">{isAwaitingOpponent ? '' : `${challengeModel.score}`}</div>
								</div>
							</div>
							{this.renderRightOpponentSide(event, challengeModel)}
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = FixtureItem;