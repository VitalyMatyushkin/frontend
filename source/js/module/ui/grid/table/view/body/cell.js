/**
 * Created by Anatoly on 20.07.2016.
 */

const   TypeList 	= require('./cell-types/cell-type-list'),
		React 		= require('react');

const Cell = React.createClass({
	propTypes: {
		column: 	React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	render: function() {
		const self = this,
			cell = self.props.column.cell,
			width = self.props.column.width,
			CellType = TypeList[cell.type];

		return (
				<CellType cell={cell} dataItem={self.props.dataItem}  width={width} />
		);
	}
});


module.exports = Cell;
