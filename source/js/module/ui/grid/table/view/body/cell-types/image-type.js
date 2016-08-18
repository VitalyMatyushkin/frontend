/**
 * Created by Anatoly on 18.08.2016.
 */

const React = require('react');

const ImageType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	render: function() {
		const value = this.props.cell.getValue(this.props.dataItem),
			result = value ? <img src={window.Server.images.getResizedToBoxUrl(value, 60, 60)}/> : null;
		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
});

module.exports = ImageType;
