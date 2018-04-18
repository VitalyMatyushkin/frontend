const 	React				= require('react'),
		DefaultRival		= require('module/as_school/pages/school_home/fixture_list/multiparty_opponent_side/default_rival'),
		InterSchoolsRival	= require('module/as_school/pages/school_home/fixture_list/multiparty_opponent_side/inter_schools_rival'),
		InterSchoolsResults	= require('module/as_school/pages/school_home/fixture_list/multiparty_opponent_side/inter_schools_results'),
		DefaultResults		= require('module/as_school/pages/school_home/fixture_list/multiparty_opponent_side/default_results'),
		propz				= require('propz'),
		DateTimeMixin		= require('module/mixins/datetime'),
		SportHelper 		= require('module/helpers/sport_helper'),
		EventHelper 		= require('module/helpers/eventHelper'),
		{ChallengeModel}	= require('module/ui/challenges/challenge_model'),
		FixtureItemStyle	= require('./../../../../../../../styles/main/b_school_fixtures.scss');

/**
 * This component is opponent part of fixture item.
 * For default type of sport between two opponents.
 */
const MultipartyOpponentSide = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	renderRival: function () {
		if(EventHelper.isInterSchoolsEvent(this.props.event)) {
			return (
				<InterSchoolsRival
					event			= {this.props.event}
					activeSchoolId	= {this.props.activeSchoolId}
				/>
			);
		} else {
			return (
				<DefaultRival
					event			= {this.props.event}
					activeSchoolId	= {this.props.activeSchoolId}
				/>
			);
		}
	},
	renderResult: function() {
		if(EventHelper.isInterSchoolsEvent(this.props.event)) {
			return (
				<InterSchoolsResults
					event			= {this.props.event}
					activeSchoolId	= {this.props.activeSchoolId}
				/>
			);
		} else {
			return (
				<DefaultResults
					event			= {this.props.event}
					activeSchoolId	= {this.props.activeSchoolId}
				/>
			);
		}
	},
	render: function() {
		const	event			= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId);

		return (
			<div className="eFixture_rightSide">
				{this.renderRival()}
				{this.renderResult()}
			</div>
		)
	}
});

module.exports = MultipartyOpponentSide;