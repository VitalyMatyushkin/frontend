/**
 * Created by Anatoly on 20.07.2016.
 */

const   TypeList 	= require('./cell-types/cell-type-list'),
		React 		= require('react');

const Cell = React.createClass({
	propTypes: {
		column: 	React.PropTypes.object,
		dataItem:	React.PropTypes.object
	},
	render: function() {
		const self = this,
			cell = self.props.column.cell,
			CellType = TypeList[cell.type];

		return (
				<CellType cell={cell} dataItem={self.props.dataItem} />
		);
	}
});

module.exports = Cell;
