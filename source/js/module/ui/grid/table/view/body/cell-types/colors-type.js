// @flow
/**
 * Created by Anatoly on 21.07.2016.
 */

const React = require('react');

const GeneralType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	render: function() {
		const 	value = this.props.cell.getValue(this.props.dataItem),
				result = value ? value.map(function(useColor,clrKey){
							return <div key={clrKey} className="eDataList_listItemColor" style={{background: useColor}}></div>
						}) : null;
		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
});

module.exports = GeneralType;
