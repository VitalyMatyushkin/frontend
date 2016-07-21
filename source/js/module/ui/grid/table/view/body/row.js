/**
 * Created by Anatoly on 20.07.2016.
 */

const   Cell 	= require('./cell'),
		React 	= require('react');

const Row = React.createClass({
	propTypes: {
		columns: 	React.PropTypes.array,
		dataItem:	React.PropTypes.object
	},
	componentWillMount: function() {
	},
	render: function() {
		return (
			<div className="eDataList_listItem">
				{this.props.columns.map((column, index) => {
					<Cell key={index} column={column} dataItem={this.props.dataItem} />
				})}
			</div>
		);
	}
});

module.exports = Row;
