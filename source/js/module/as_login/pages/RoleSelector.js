/**
 * Created by wert on 16.01.16.
 */
const 	React 		= require('react'),
		RoleHelper  = require('module/helpers/role_helper'),
		Auth 		= require('module/core/services/AuthorizationServices'),
		RSC			= require('./RoleSelectorComponent');

const RoleSelector = React.createClass({
	componentWillMount:function(){
		const self = this;
		const availableRoles = self.props.availableRoles;

		if(availableRoles.length == 1) {
			self.redirectToStartPage(availableRoles[0]);
		}
		if(availableRoles.length === 0){
			self.redirectToStartPage('no_body');
		}
	},
	getRoleSubdomain: function(roleName) {
		return RoleHelper.roleMapper[roleName.toLowerCase()];
	},
	redirectToStartPage: function(roleName) {
		const 	self 			= this,
				roleSubdomain 	= self.getRoleSubdomain(roleName),
				subdomains 		= document.location.host.split('.');
		let defaultPage;

		subdomains[0] = roleSubdomain;
		switch (roleSubdomain) {
			case 'manager':
				defaultPage = `school_admin/summary`;
				break;
			case 'parents':
				defaultPage = `events/calendar/all`;
				break;
			default:
				defaultPage = `settings/general`;
				subdomains[0] = 'manager';
				break;
		}
		const domain = subdomains.join(".");
		window.location.href = `//${domain}/#${defaultPage}`;
	},
	onRoleSelected: function(roleName){
		Auth.become(roleName).then(data => {
			return this.redirectToStartPage(roleName.toLowerCase());
		});
	},
	render: function(){
		const availableRoles = this.props.availableRoles;
		if(availableRoles.length > 1) {	// not drawing roles if there is only one. It will be selected automatically
			return <RSC availableRoles={availableRoles} onRoleSelected={this.onRoleSelected}/>;
		}
		if(availableRoles.length === 1) {
			this.onRoleSelected(availableRoles[0])
		}
		return null;
	}
});


module.exports = RoleSelector;
