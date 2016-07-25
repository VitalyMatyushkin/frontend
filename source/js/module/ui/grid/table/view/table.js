/**
 * Created by Anatoly on 19.07.2016.
 */

const   Header	= require('./header'),
		Body	= require('./body'),
        React 	= require('react');

const Table = React.createClass({
	propTypes: {
		model: 		React.PropTypes.object
	},
	componentWillMount: function() {
	},
	render: function() {
		const model = this.props.model;

		return (
		<div className="bDataList">
			<div className="eDataList_list mTable">
				<Header columns={model.columns} order={model.order} />
				<Body columns={model.columns} data={model.data} />
			</div>
		</div>
		)
	}
});

module.exports = Table;
