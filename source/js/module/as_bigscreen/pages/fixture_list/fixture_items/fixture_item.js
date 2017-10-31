const	React 					= require('react'),

		ChallengeModel			= require('./../../../../ui/challenges/challenge_model'),
		EventResultView			= require('./event_views/event_result_view'),
		FixtureItemFooter	= require('./footer/fixture_item_footer');

const FixtureItem = React.createClass({
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		event:			React.PropTypes.object.isRequired
	},

	render: function() {
		const model = new ChallengeModel(this.props.event, this.props.activeSchoolId);

		return (
			<div className="bFixtureItem">
				<EventResultView model={model} event={this.props.event} activeSchoolId={this.props.activeSchoolId}/>
				<FixtureItemFooter model={model}/>
			</div>
		)
	}
});

module.exports = FixtureItem;