/**
 * Created by Anatoly on 30.07.2016.
 */

const React = require('react');

const FilterStringType = React.createClass({
	propTypes: {
		model: 		React.PropTypes.object
	},
	render: function() {
		const value = this.props.cell.getValue(this.props.dataItem),
			result = value ? value : null;
		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
});

module.exports = FilterStringType;
