const	React				= require('react'),
		DefaultResultsStyle	= require('./../../../../../../../styles/ui/b_default_results/b_default_results.scss');

const DefaultResults = React.createClass({
	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<div className="bDefaultResults">
				Click here for more details
			</div>
		)
	}
});

module.exports = DefaultResults;