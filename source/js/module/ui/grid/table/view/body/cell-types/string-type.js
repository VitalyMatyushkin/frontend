/**
 * Created by Anatoly on 21.07.2016.
 */

const   If              = require('module/ui/if/if'),
	React           = require('react');

const StringType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object,
		dataItem:	React.PropTypes.object
	},
	render: function() {
		const value = this.props.cell.getValue(this.props.dataItem),
			result = value ? value : null;
		return <span>{result}</span>;
	}
});

module.exports = StringType;
