/**
 * Created by Anatoly on 21.07.2016.
 */

const 	SVG 	= require('module/ui/svg'),
		React 	= require('react');

const GeneralType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	getGender: function (gender) {
		const icon = gender === 'MALE' ? 'icon_man': 'icon_woman';

		return <SVG classes="bIcon-gender" icon={icon} />;
	},
	render: function() {
		const 	value 	= this.props.cell.getValue(this.props.dataItem),
				result 	= value ? this.getGender(value) : null;

		return (
			<div className="eDataList_listItemCell">
				{result}
			</div>
		);
	}
});

module.exports = GeneralType;
