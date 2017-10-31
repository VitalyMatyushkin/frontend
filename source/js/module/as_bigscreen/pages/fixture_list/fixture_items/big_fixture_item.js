const	React 					= require('react'),

		ChallengeModel			= require('./../../../../ui/challenges/challenge_model'),
		BigEventResultView		= require('./event_views/big_event_result_view'),
		FixtureItemFooterFooter	= require('./footer/fixture_item_footer');

const BigFixtureItem = React.createClass({
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		event:			React.PropTypes.object.isRequired
	},

	render: function() {
		const model = new ChallengeModel(this.props.event, this.props.activeSchoolId);

		return (
			<div className="bFixtureItem">
				<BigEventResultView model={model} event={this.props.event} activeSchoolId={this.props.activeSchoolId}/>
				<FixtureItemFooterFooter model={model}/>
			</div>
		)
	}
});

module.exports = BigFixtureItem;