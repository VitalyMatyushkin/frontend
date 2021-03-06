/**
 * Created by wert on 06.09.16.
 */

const 	React				= require('react'),
		propz				= require('propz'),
		DateTimeMixin		= require('module/mixins/datetime'),
		EventHelper			= require('module/helpers/eventHelper'),
		SportHelper 		= require('module/helpers/sport_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		SportIcon			= require('module/ui/icons/sport_icon'),
		{ChallengeModel}	= require('module/ui/challenges/challenge_model'),
		{DateHelper} 	    = require('module/helpers/date_helper'),
		FixtureItemStyle	= require('./../../../../../styles/main/b_school_fixtures.scss');

const FixtureItem = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired,
		region:         React.PropTypes.string
	},
	handleClickFixtureItem: function() {
		document.location.hash = `event/${this.props.event.id}`;
	},
	getFixtureInfo: function(event) {
		const eventName = propz.get(event, ['generatedNames', this.props.activeSchoolId]) || propz.get(event, ['generatedNames', 'official']);
		return(
			<div>
				<div className="bFix_date">{DateHelper.getLongDateTimeStringByRegion(event.startTime, this.props.region)}</div>
				<div className="bFix_name">{eventName}</div>
				<div className="bFix_type">{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}</div>
			</div>
		)
	},
	cropOpponentName: function(name) {
		if (name == null)
			return;
		var maxLength = 40;
		if (name.length > maxLength) {
			name = name.substr(0,maxLength-3) + "...";
		}
		return name;
	},
	renderOpponentByOrder: function (order, event, model) {
		let imgStyle = {backgroundImage:''};
		let name = '';

		const currentRival = model.rivals[order];
		switch ( true ) {
			case typeof currentRival !== 'undefined' && TeamHelper.isNewEvent(event): {
				imgStyle = {
					backgroundImage: 'url(' + currentRival.school.pic + ')'
				};
				name = typeof currentRival.team !== 'undefined' ?
					`${currentRival.team.name} [${currentRival.school.name}]` :
					currentRival.school.name;
				break;
			}
			case typeof currentRival !== 'undefined' && !TeamHelper.isNewEvent(event): {
				imgStyle = {
					backgroundImage: 'url(' + currentRival.schoolPic + ')'
				};
				name = currentRival.value;
				break;
			}
		}

		return (
			<div className="eFixture_item mOpponent">
				<div className="eFixture_item_imgContainer">
					<div className = "eFixture_item_img" style = { imgStyle } />
				</div>
				<div className="eFixture_item mSchoolName">
					{ this.cropOpponentName(name) }
				</div>
			</div>
		);
	},

	render: function() {
		const 	event 				= this.props.event,
				sportName			= event.sport.name,
				// activeSchoolId		= this.props.activeSchoolId,
				 /* Important. This fixture_item used for showing union events. So, active school id is union's id.
				  * But this not fit to ChallengeModel used below. So we just setting activeSchoolId to
				  * inviterSchoolId which is absolutely correct for showing events on union's site
				  *
				  */
				activeSchoolId				= event.inviterSchoolId,
				isAwaitingOpponent			= event.status === 'INVITES_SENT',
				challengeModel				= new ChallengeModel(event, activeSchoolId, 'SchoolUnion'),
				challengeModelForCricket	= new ChallengeModel(event, '', 'SchoolUnion'), //for school union public site we don't use activeSchoolId
				score 						= SportHelper.isCricket(challengeModel.sport) ? challengeModelForCricket.textResult : challengeModel.score,
				scoreText 					= SportHelper.isCricket(challengeModel.sport) ? '' : 'Score';

		return (
			<div className="bFixtureContainer">
				<div className="eFixture_row">
					<div className="eFixture_content" onClick={ this.handleClickFixtureItem }>
						<div className="eFixture_leftSide">
							<div className="eFixture_item mSport">
								<SportIcon name={sportName || ''} className="bIcon_mSport"/>
							</div>
							<div className="eFixture_item mInfo">
								{ this.getFixtureInfo(event) }
							</div>
						</div>
						<div className="eFixture_rightSide">
							{ this.renderOpponentByOrder(0, event, challengeModel) }
							<div className="eFixture_item mResult">
								<div>
									<div className="bFix_scoreText">{isAwaitingOpponent ? 'Awaiting opponent' : scoreText}</div>
									<div className="bFix_scoreResult">{isAwaitingOpponent ? '' : `${score}`}</div>
								</div>
							</div>
							{ this.renderOpponentByOrder(1, event, challengeModel) }
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = FixtureItem;