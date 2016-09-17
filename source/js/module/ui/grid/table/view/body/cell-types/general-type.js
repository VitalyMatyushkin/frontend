/**
 * Created by Anatoly on 21.07.2016.
 */

const React = require('react');

const GeneralType = function(props){
	const 	value 	= props.cell.getValue(props.dataItem),
			result 	= value ? value : null;

	return (
		<div className="eDataList_listItemCell">
			{result}
		</div>
	);
};

GeneralType.propTypes = {
	cell: 		React.PropTypes.object.isRequired,
	dataItem:	React.PropTypes.object.isRequired
};

module.exports = GeneralType;
