/**
 * Created by Anatoly on 20.07.2016.
 */

const   Cell 	= require('./cell'),
		React 	= require('react');

const Row = React.createClass({
	propTypes: {
		columns: 	React.PropTypes.array.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	componentWillMount: function() {
	},
	render: function() {
		return (
			<div className="eDataList_listItem">
				{this.props.columns.map((column, index) => {
					/** why index? - for the column key number of sequence is sufficient. */
					return <Cell key={index} column={column} dataItem={this.props.dataItem} />
				})}
			</div>
		);
	}
});

module.exports = Row;
