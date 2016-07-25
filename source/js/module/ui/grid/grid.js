/**
 * Created by Anatoly on 21.07.2016.
 */
const 	ActionPanel = require('./action-panel/action-panel'),
		FilterPanel = require('./filter/filter-panel/filter-panel'),
		Table 		= require('./table/view/table'),
		GridModel 	= require('./grid-model'),
		React 		= require('react');

const Grid = React.createClass({
	propTypes: {
		data: 		React.PropTypes.array,
		columns: 	React.PropTypes.array,
		filters: 	React.PropTypes.object,
		onChange:	React.PropTypes.func
	},
	componentWillMount: function() {
		this.model = new GridModel(this.props);
	},
	render: function() {
		const model = this.model;

		return (
			<div className="bGrid">
				<h1>New Grid</h1>
				<ActionPanel model={model.actionPanel} />
				<FilterPanel model={model.filterPanel} />
				<Table model={model.table} />
			</div>
		);
	}
});

module.exports = Grid;