const	React					= require('react'),

		{ChallengeModel}		= require('../../../../ui/challenges/challenge_model'),
		UpcomingEventView		= require('./event_views/upcoming_event_view'),
		FixtureItemFooterFooter	= require('./footer/fixture_item_footer');

const UpcomingFixtureItem = React.createClass({
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		event:			React.PropTypes.object.isRequired
	},

	render: function() {
		const model = new ChallengeModel(this.props.event, this.props.activeSchoolId);

		return (
			<div className="bFixtureItem">
				<UpcomingEventView model={model}/>
				<FixtureItemFooterFooter model={model}/>
			</div>
		)
	}
});

module.exports = UpcomingFixtureItem;