/**
 * Created by wert on 06.09.16.
 */

const 	React					= require('react'),
		propz					= require('propz'),
		MultipartyOpponentSide	= require('module/as_school/pages/school_home/fixture_list/multiparty_opponent_side/multiparty_opponent_side'),
		TwoTeamOpponentSide		= require('module/as_school/pages/school_home/fixture_list/two_team_opponent_side'),
		IndividualInternalSide	= require('module/as_school/pages/school_home/fixture_list/individual_internal_side'),
		DateTimeMixin			= require('module/mixins/datetime'),
		EventHelper				= require('module/helpers/eventHelper'),
		SportIcon				= require('module/ui/icons/sport_icon'),
		FixtureItemStyle		= require('./../../../../../../styles/main/b_school_fixtures.scss');

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
	renderOpponentSide: function() {
		const	event				= this.props.event,
				activeSchoolId		= this.props.activeSchoolId;
		/*
		 The second part of the condition:
		 If event is internal and sport for this event is individual
		 */
		if(event.sport.multiparty && event.teamsData.length !== 2) {
			return (
				<MultipartyOpponentSide
					event			= { event }
					activeSchoolId	= { activeSchoolId }
				/>
			);
		} else if(event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping.internal && event.sport.individualResultsAvailable) {
			return (
				<IndividualInternalSide
					event			= { event }
					activeSchoolId	= { activeSchoolId }
				/>
			);
		} else {
			return (
				<TwoTeamOpponentSide
					event			= { event }
					activeSchoolId	= { activeSchoolId }
				/>
			);
		}
	},
	render: function() {
		const	event		= this.props.event,
				sportName	= event.sport.name;

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
						{this.renderOpponentSide()}
					</div>
				</div>
			</div>
		)
	}
});

module.exports = FixtureItem;