const	React				= require ('react'),
		If					= require ('../../../../ui/if/if'),
		propz				= require ('propz'),
		SchoolListItemStyle	= require('../../../../../../styles/ui/b_school_list_item.scss');

const SchoolListItem = React.createClass({
	propTypes: {
		isSelected	: React.PropTypes.bool.isRequired,
		onMouseDown	: React.PropTypes.func.isRequired,
		data		: React.PropTypes.object.isRequired
	},
	getAddress: function() {
		let postcode = propz.get(this.props.data, ['postcode', 'postcode']);

		if(typeof postcode !== 'undefined') {
			postcode = `(${postcode})`;
		} else {
			postcode = '';
		}

		return `${this.props.data.address} ${postcode}`;
	},
	render: function() {
		return (
			<div	className	= "bSchoolListItem"
					onMouseDown	= {this.props.onMouseDown}
			>
				<div className="eSchoolListItem_wrapper">
					<If condition={typeof this.props.data.pic !== 'undefined'}>
						<img	className	= "eSchoolListItem_pic"
								src			= {this.props.data.pic}
								height		= "40px"
								width		= "40px"
						/>
					</If>
					<div	className	= "eSchoolListItem_name">
						{this.props.data.name}
					</div>
				</div>
				<If condition={typeof this.props.data.address !== 'undefined'}>
					<div className="eSchoolListItem_address">
						Address: {this.getAddress()}
					</div>
				</If>
			</div>
		)
	}
});

module.exports = SchoolListItem;