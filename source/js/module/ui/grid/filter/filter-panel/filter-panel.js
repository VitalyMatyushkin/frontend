/**
 * Created by Anatoly on 24.07.2016.
 */
const   React 	= require('react');

const FilterPanel = React.createClass({
	propTypes: {
	},
	componentWillMount: function() {
	},
	render: function() {
		return (
			<div className="bFilterPanel">
				<div className="bFilterFields"></div>
			</div>
		);
	}
});

module.exports = FilterPanel;