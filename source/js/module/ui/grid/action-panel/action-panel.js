/**
 * Created by Anatoly on 24.07.2016.
 */
const   React 	= require('react');

const ActionPanel = React.createClass({
	propTypes: {
		model: React.PropTypes.object
	},
	componentWillMount: function() {
	},
	render: function() {
		return (
			<div className="bActionPanel">
				<h2>Action Panel</h2>
			</div>
		);
	}
});

module.exports = ActionPanel;