const React = require('react');

const UserViewSummary = React.createClass({

	propTypes: {
		selectedUserData: React.PropTypes.object
	},
	
	getGender: function (gender) {
		switch (gender) {
			case 'MALE':
				return 'Male';
			case 'FEMALE':
				return 'Female';
			default:
				return 'Not defined';
		}
	},
	
	render: function(){
		
		if (typeof this.props.selectedUserData !== 'undefined') {
			const 	name 	= this.props.selectedUserData.firstName + ' ' + this.props.selectedUserData.lastName,
					gender 	= this.props.selectedUserData.gender,
					email 	= this.props.selectedUserData.email,
					phone 	= this.props.selectedUserData.phone ? this.props.selectedUserData.phone : '',
					avatar 	= this.props.selectedUserData.avatar;
			
			return (
				<div className="eSchoolMaster_summary_wrap">
					<div className="eSchoolMaster_title">
						{avatar ? <span><h3>Photo</h3><img src={avatar}/></span> : <span><h3>Photo</h3><img src='/images/empty_pic_uploader_box.png' /></span>}
					</div>
					<div className="eSchoolMaster_fields">
						<h3>Summary</h3>
						<div className="eSchoolMaster_field">
							<div className="eSchoolMaster_field_name">Name:</div>
							<div className="eSchoolMaster_field_value">{name}</div>
						</div>
						<div className="eSchoolMaster_field">
							<div className="eSchoolMaster_field_name">Gender:</div>
							<div className="eSchoolMaster_field_value">{this.getGender(gender)}</div>
						</div>
						<div className="eSchoolMaster_field">
							<div className="eSchoolMaster_field_name">Email:</div>
							<div className="eSchoolMaster_field_value">{email}</div>
						</div>
						<div className="eSchoolMaster_field">
							<div className="eSchoolMaster_field_name">Phone:</div>
							<div className="eSchoolMaster_field_value">{phone}</div>
						</div>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}
});

module.exports = UserViewSummary;