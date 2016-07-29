/**
 * Created by Anatoly on 21.07.2016.
 */
const 	ActionPanel = require('./action-panel/action-panel'),
		FilterPanel = require('./filter/filter-panel/filter-panel'),
		Table 		= require('./table/view/table'),
		Pagination 	= require('./filter/pagination'),
		React 		= require('react');

const Grid = React.createClass({
	propTypes: {
		model: 	React.PropTypes.object
	},
	componentWillMount: function() {
	},
	render: function() {
		const model = this.props.model;

		return (
			<div className="bGrid">
				<ActionPanel model={model.actionPanel} />
				<FilterPanel model={model.filterPanel} />
				<Table model={model.table} />
				<Pagination model={model.pagination} />
			</div>
		);
	}
});

module.exports = Grid;