/**
 * Created by Anatoly on 21.11.2016.
 */

const 	React		= require('react'),
    Avatar			= require('module/ui/avatar/avatar');

const AvatarType = React.createClass({
	propTypes: {
		cell: 		React.PropTypes.object.isRequired,
		dataItem:	React.PropTypes.object.isRequired
	},
	getAvatar: function (avatarUrl) {
		if(avatarUrl){
			return <Avatar pic={avatarUrl} />
		} else
			return null;
	},
	render: function() {
		const 	value 	= this.props.cell.getValue(this.props.dataItem);

		return (
			<div className="eDataList_listItemCell">
				{this.getAvatar(value)}
			</div>
		);
	}
});

module.exports = AvatarType;
