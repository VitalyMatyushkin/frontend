/**
 * Created by Anatoly on 20.07.2016.
 */

const   Row 	= require('./body/row'),
		React 	= require('react');

const Body = React.createClass({
	propTypes: {
		columns: 	React.PropTypes.array,
		data:		React.PropTypes.array
	},
	render: function() {
		const self = this,
			data = self.props.data,
			columns = self.props.columns;

		return data.map((item, index) => {
			<Row key={item.id ? item.id : index} dataItem={item} columns={columns} />
		});
	}
});

module.exports = Body;
