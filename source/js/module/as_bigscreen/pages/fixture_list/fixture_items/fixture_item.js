const	React 					= require('react'),

		ChallengeModel			= require('./../../../../ui/challenges/challenge_model'),
		EventResultView			= require('./event_views/event_result_view'),
		FixtureItemFooterFooter	= require('./footer/fixture_item_footer');

const FixtureItem = React.createClass({
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		event:			React.PropTypes.object.isRequired
	},

	render: function() {
		const model = new ChallengeModel(this.props.event, this.props.activeSchoolId);

		return (
			<div className="bFixtureItem">
				<EventResultView model={model}/>
				<FixtureItemFooterFooter model={model}/>
			</div>
		)
	}
});

module.exports = FixtureItem;