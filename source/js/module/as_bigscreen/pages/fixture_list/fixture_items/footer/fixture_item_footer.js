const React = require('react');

const FixtureItemFooterFooter = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model;

		return (
			<div className="bEventResultFooter">
				{ `${model.sport} - ${model.date}` }
			</div>
		);
	}
});

module.exports = FixtureItemFooterFooter;