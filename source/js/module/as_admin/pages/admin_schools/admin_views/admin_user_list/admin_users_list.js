/**
 * Created by Anatoly on 25.04.2016.
 */

const	React			= require('react'),
		Morearty		= require('morearty'),
		UserList		= require('module/shared_pages/users/user_list/users'),
		GrantRole		= require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
		{SVG}			= require('module/ui/svg');

const AdminUsersList = React.createClass({
	mixins:[Morearty.Mixin],

	adminCreateNewUser: function(){
		document.location.hash = 'users/admin_views/create_user';
	},
	
	//The function, which will call when user click on <Row> in Grid
	getItemViewFunction: function(id){
		window.location.hash = 'user/view?id=' + id;
	},
	
	render:function(){
		const binding = this.getDefaultBinding();
		const addButton	= (
			<div id="addUser_button" className="bButtonAdd bTooltip" onClick={this.adminCreateNewUser} data-description="Add user">
				<SVG icon="icon_add_men" />
			</div>
		);

		return (
			<UserList
				handleClick				={ this.getItemViewFunction}
				binding					={ binding }
				grantRole				={ GrantRole }
				addButton				={ addButton }
				blockService			={ window.Server.userBlock }
				permissionServiceName	="userPermission"
			/>
		);

	}
});

module.exports = AdminUsersList;