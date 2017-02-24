const	React				= require ('react');

const	If					= require ('../../../../ui/if/if');

const	SchoolListItemStyle	= require('../../../../../../styles/ui/b_school_list_item.scss');

const SchoolListItem = React.createClass({
	propTypes: {
		isSelected	: React.PropTypes.bool.isRequired,
		onMouseDown	: React.PropTypes.func.isRequired,
		school		: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div	className	= "bSchoolListItem"
					onMouseDown	= {this.props.onMouseDown}
			>
				<div className="eSchoolListItem_wrapper">
					<If condition={typeof this.props.school.pic !== 'undefined'}>
						<img	className	= "eSchoolListItem_pic"
								src			= {this.props.school.pic}
								height		= "40px"
								width		= "40px"
						/>
					</If>
					<div	className	= "eSchoolListItem_name">
						{this.props.school.name}
					</div>
				</div>
				<If condition={typeof this.props.school.address !== 'undefined'}>
					<div className="eSchoolListItem_address">
						Address: {this.props.school.address}
					</div>
				</If>
			</div>
		)
	}
});

module.exports = SchoolListItem;