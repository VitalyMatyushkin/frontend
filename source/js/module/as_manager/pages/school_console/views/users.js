/**
 * Created by Anatoly on 25.04.2016.
 */

const 	React 		= require('react'),
		UserList 	= require('module/shared_pages/users/user_list/users'),
		Morearty	= require('morearty'),
		{GrantRole} = require('module/as_manager/pages/school_console/grant_role/grant_role');

const AdminUsersList = React.createClass({
	mixins:[Morearty.Mixin],
	
	//The function, which will call when user click on <Row> in Grid
	getItemViewFunction:function(id){
		window.location.hash = 'user/view?id=' + id;
	},
	
	render:function(){
		const binding = this.getDefaultBinding();

		return (
			<UserList
				handleClick				= { this.getItemViewFunction }
				binding					= { binding }
				grantRole				= { GrantRole }
				permissionServiceName	= "schoolUserPermission"
			/>
		);

	}
});
module.exports = AdminUsersList;