/**
 * Created by Anatoly on 19.07.2016.
 */

const   Header	= require('./header'),
		Body	= require('./body'),
        React 	= require('react');

const TableView = React.createClass({
	propTypes: {
		data: 		React.PropTypes.array,
		columns: 	React.PropTypes.array,
		order: 		React.PropTypes.object
	},
	componentWillMount: function() {
	},
	render: function() {
		return (
		<div className="bDataList">
			<div className="eDataList_list mTable">
				<Header columns={this.props.columns} order={this.props.order} />
				<Body columns={this.props.columns} data={this.props.data} />
			</div>
		</div>
		)
	}
});

module.exports = TableView;
