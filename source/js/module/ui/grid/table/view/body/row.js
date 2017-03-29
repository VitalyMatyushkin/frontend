// @flow

/**
 * Created by Anatoly on 20.07.2016.
 */

const 	Cell 	= require('./cell'),
		React 	= require('react');

const Row = React.createClass({
	propTypes: {
		columns: 		React.PropTypes.array.isRequired,
		dataItem:		React.PropTypes.object.isRequired,
		//The function, which will call when user click on <Row> in Grid
		handleClick:	React.PropTypes.func
	},

	onClickRow: function(){
		if(this.props.handleClick) {
			this.props.handleClick(this.props.dataItem.id, this.props.dataItem.name);
		}
	},
	
	render: function() {
		return (
			<div className="eDataList_listItem" onClick={this.onClickRow} >
				{this.props.columns.map((column, index) => {
					/** why index? - for the column key number of sequence is sufficient. */
					return <Cell key={index} column={column} dataItem={this.props.dataItem} />
				})}
			</div>
		);
	}
});

module.exports = Row;
