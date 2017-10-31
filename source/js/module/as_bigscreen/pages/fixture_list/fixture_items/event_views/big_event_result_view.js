const 	React 		= require('react'),
		MultipartyOpponentSide	= require('module/as_bigscreen/pages/fixture_list/fixture_items/opponent_side/multiparty_opponent_side/multiparty_opponent_side'),
		TwoTeamOpponentSide		= require('module/as_bigscreen/pages/fixture_list/fixture_items/opponent_side/two_team_opponent_side'),
		SportHelper = require('module/helpers/sport_helper');

const EventResultCricketViewStyles = require('styles/ui/bid_screen_fixtures/bEventResultCricketView.scss');

const BigEventResultView = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	renderResults: function() {
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
		}  else {
			return (
				<TwoTeamOpponentSide
					event			= { event }
					activeSchoolId	= { activeSchoolId }
				/>
			);
		}
	},

	render: function() {
		return this.renderResults();
	}
});

module.exports = BigEventResultView;