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
		model: 	React.PropTypes.object.isRequired,
		id:     React.PropTypes.string
	},
	componentWillMount:function(){
		this.props.model.onRender = this.onRender;
	},
	componentWillUnmount:function(){
		this.props.model.onRender = null;
	},
	/**start re-render. Model use it for re-render component*/
	onRender:function(){
		this.setState({renderStart: new Date()});
	},
	render: function() {
		const 	model 				= this.props.model,
				id					= this.props.id,
				classStyleAdmin 	= model.classStyleAdmin ? ' bGrid-wide' : '',
				//The function, which will call when user click on <Row> in Grid otherwise we display in console log warning
				handleClick 		= model.handleClick ? model.handleClick : () => {console.warn('Warning: There is no function in grid for click on row')},
				mHidden 			= !model.actionPanel.isFilterActive ? 'mHidden' : null;

		return (
			<div className={"bGrid" + classStyleAdmin} id={id}>
				<ActionPanel model={model.actionPanel} />
				<div className={mHidden}>
					<FilterPanel model={model.filterPanel} />
				</div>
				<Table model={model.table} handleClick={handleClick} />
				<Pagination model={model.pagination} />
			</div>
		);
	}
});

module.exports = Grid;