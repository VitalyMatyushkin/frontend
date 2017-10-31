/**
 * Created by vitaly on 30.10.17.
 */
const 	React				= require('react'),
		InterSchoolsRival	= require('module/as_bigscreen/pages/fixture_list/fixture_items/opponent_side/multiparty_opponent_side/inter_schools_rival'),
		InterSchoolsResults	= require('module/as_bigscreen/pages/fixture_list/fixture_items/opponent_side/multiparty_opponent_side/inter_schools_results'),
		propz				= require('propz'),
		DateTimeMixin		= require('module/mixins/datetime'),
		SportHelper 		= require('module/helpers/sport_helper'),
		EventHelper 		= require('module/helpers/eventHelper'),
		ChallengeModel		= require('module/ui/challenges/challenge_model');

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
		return (
			<InterSchoolsRival
				event			= {this.props.event}
				activeSchoolId	= {this.props.activeSchoolId}
			/>
		);

	},
	renderResult: function() {
		return (
			<InterSchoolsResults
				event			= {this.props.event}
				activeSchoolId	= {this.props.activeSchoolId}
			/>
		);
	},
	render: function() {
		const	event			= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId);

		return (
			<div className="bEventResultView">
				{this.renderRival()}
				{this.renderResult()}
			</div>
		)
	}
});

module.exports = MultipartyOpponentSide;