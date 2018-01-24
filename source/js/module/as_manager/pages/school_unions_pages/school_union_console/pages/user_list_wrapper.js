const	React		= require('react'),
		Morearty	= require('morearty'),
		{GrantRole}	= require('module/as_manager/pages/school_console/grant_role/grant_role'),
		UserList	= require('../../../../../shared_pages/users/user_list/users');

const UserListWrapper = React.createClass({
	mixins:[Morearty.Mixin],
	render:function(){
		const binding = this.getDefaultBinding();

		return (
			<UserList	binding					= {binding}
						grantRole				= {GrantRole}
						permissionServiceName	= "schoolUserPermission"
						customActionList		= {['View']}
			/>
		);
	}
});

module.exports = UserListWrapper;