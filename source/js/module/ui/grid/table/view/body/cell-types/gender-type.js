// @flow
/**
 * Created by Anatoly on 21.07.2016.
 */

const 	React		= require('react'),
		GenderIcon	= require('module/ui/icons/gender_icon');

const GenderType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	getGender: function (gender: string) {
		if(gender) {
			return <GenderIcon classes="bIcon-gender" gender={gender}/>;
		} else
			return null;
	},
	render: function() {
		const 	value 	= this.props.cell.getValue(this.props.dataItem);

		return (
			<div className="eDataList_listItemCell">
				{this.getGender(value)}
			</div>
		);
	}
});

module.exports = GenderType;
