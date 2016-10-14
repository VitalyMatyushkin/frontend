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
		model: 	React.PropTypes.object.isRequired
	},
	componentWillMount:function(){
		this.props.model.onRender = this.onRender;
	},
	onRender:function(){
		this.setState({renderStart: new Date()});
	},
	render: function() {
		const model = this.props.model,
			mHidden = !model.actionPanel.isFilterActive ? 'mHidden' : null;

		return (
			<div className="bGrid">
				<ActionPanel model={model.actionPanel} />
				<div className={mHidden}>
					<FilterPanel model={model.filterPanel} />
				</div>
				<Table model={model.table} />
				<Pagination model={model.pagination} />
			</div>
		);
	}
});

module.exports = Grid;