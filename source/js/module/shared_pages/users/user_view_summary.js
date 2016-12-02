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
              return '';
      }
  },

	render: function(){

		if (typeof this.props.selectedUserData !== 'undefined') {
			const name = this.props.selectedUserData.firstName + ' ' + this.props.selectedUserData.lastName;
			const gender = this.props.selectedUserData.gender;
			const email = this.props.selectedUserData.email;
			const phone = this.props.selectedUserData.phone ? this.props.selectedUserData.phone : '';
			const avatar = this.props.selectedUserData.avatar;

			return (
				<div className="eSchoolMaster_summary_wrap">
					<div className="eSchoolMaster_title">
			        {avatar ? <div><h3>Photo</h3><img src={avatar}/></div> : ''}
		    	</div>
			    <div className="eSchoolMaster_field">
		        <h3>Summary</h3>
		        <div>
		            <span>Name: </span>{name}
		        </div>
		        <div>
		            <span>Gender: </span>{this.getGender(gender)}
		        </div>
		        <div>
		            <span>Email: </span>{email}
		        </div>
		        <div>
		            <span>Phone: </span>{phone}
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