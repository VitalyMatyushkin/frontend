/**
 * Created by Anatoly on 09.09.2016.
 */

const React = require('react');

const EmailUrlType = function(props){
	const 	value 	= props.cell.getValue(props.dataItem),
			cellStyle 	= props.width ? {maxWidth: props.width} : null,
			result 	= value ? value : null;

	return (
		<div className="eDataList_listItemCell mBreakWord" style={cellStyle}>
			{result}
		</div>
	);
};

EmailUrlType.propTypes = {
	cell: 		React.PropTypes.object.isRequired,
	dataItem:	React.PropTypes.object.isRequired,
	width:		React.PropTypes.string
};

module.exports = EmailUrlType;
