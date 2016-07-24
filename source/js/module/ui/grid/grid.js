/**
 * Created by Anatoly on 21.07.2016.
 */
const   React 	= require('react');

const Table = React.createClass({
	propTypes: {
		data: 		React.PropTypes.array,
		columns: 	React.PropTypes.array.isRequired,
		filters: 	React.PropTypes.object,
		onChange:	React.PropTypes.func
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

module.exports = Table;