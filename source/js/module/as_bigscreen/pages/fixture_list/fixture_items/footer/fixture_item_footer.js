const	React	= require('react'),

		{DateHelper}	= require('../../../../../helpers/date_helper');

const FixtureItemFooter = React.createClass({
	propTypes: {
		model: React.PropTypes.object.isRequired
	},

	render: function() {
		const model = this.props.model;

		return (
			<div className="bEventResultFooter">
				{ `${model.sport} - ${DateHelper.getShortDateString(new Date(model.dateUTC))}` }
			</div>
		);
	}
});

module.exports = FixtureItemFooter;