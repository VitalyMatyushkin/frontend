/**
 * Created by Anatoly on 20.07.2016.
 */

const   If              = require('module/ui/if/if'),
		Sort			= require('./sort'),
		React           = require('react');

const HeadCell = React.createClass({
	propTypes: {
		column: React.PropTypes.object,
		order: React.PropTypes.object
	},
	componentWillMount: function() {
	},
	render: function() {
		const 	column 		= this.props.column,
				value		= this.props.order[this.props.column],
				cellStyle 	= column.width ? {width:column.width}:null;

		return (
			<div className="eDataList_listItemCell" style={cellStyle}>
				{column.text}
				<If condition={column.isSorted}>
					<Sort dataField={column.cell.dataField} onSort={column.onSort} sortValue={value} />
				</If>
			</div>
		)
	}
});

module.exports = HeadCell;
