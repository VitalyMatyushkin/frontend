// @flow
/**
 * Created by Anatoly on 26.07.2016.
 */

const React = require('react');

const CustomType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	render: function() {
		const parseFunction = this.props.cell.typeOptions.parseFunction,
			result = parseFunction ? parseFunction(this.props.dataItem) : null;
		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
});

module.exports = CustomType;
