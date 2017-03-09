const	React				= require ('react');

const	If					= require ('../../../../ui/if/if');

const	SchoolListItemStyle	= require('../../../../../../styles/ui/b_school_list_item.scss');

const SchoolListItem = React.createClass({
	propTypes: {
		isSelected	: React.PropTypes.bool.isRequired,
		onMouseDown	: React.PropTypes.func.isRequired,
		data		: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div	className	= "bSchoolListItem"
					onMouseDown	= {this.props.onMouseDown}
			>
				<div className="eSchoolListItem_wrapper">
					<If condition={typeof this.props.data.pic !== 'undefined'}>
						<div className = "eSchoolListItem_wrapper_pic">
							<img	className	= "eSchoolListItem_pic"
									src			= {this.props.data.pic}
							/>
						</div>
					</If>
					<div	className	= "eSchoolListItem_name">
						{this.props.data.name}
					</div>
				</div>
				<If condition={typeof this.props.data.address !== 'undefined'}>
					<div className="eSchoolListItem_address">
						Address: {this.props.data.address}
					</div>
				</If>
			</div>
		)
	}
});

module.exports = SchoolListItem;