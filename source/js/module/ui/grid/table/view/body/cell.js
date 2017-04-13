// @flow
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
		const 	cell		= this.props.column.cell,
				width		= this.props.column.width,
				CellType	= TypeList[cell.type];

		return (
				<CellType cell={cell} dataItem={this.props.dataItem}  width={width} />
		);
	}
});

module.exports = Cell;
