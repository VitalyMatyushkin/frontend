/**
 * Created by wert on 16.01.16.
 */
const 	React 		= require('react'),
		RoleHelper  = require('module/helpers/role_helper'),
		Auth 		= require('../../core/services/AuthorizationServices'),
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
		const	self			= this,
				roleSubdomain	= self.getRoleSubdomain(roleName),
				subdomains		= document.location.host.split('.');

		let defaultPage;

		switch (roleName) {
			case 'owner':
				defaultPage = `school_admin/summary`;
				break;
			case 'admin':
				defaultPage = `school_admin/summary`;
				break;
			case 'manager':
				defaultPage = `school_admin/summary`;
				break;
			case 'teacher':
				defaultPage = `school_admin/summary`;
				break;
			case 'trainer':
				defaultPage = `school_admin/summary`;
				break;
			case 'parent':
				defaultPage = `events/calendar/all`;
				break;
			default:
				defaultPage = `settings/general`;
				subdomains[0] = 'app';
				break;
		}

		subdomains[0] = roleSubdomain;
		const domain = subdomains.join(".");
		window.location.href = `//${domain}/#${defaultPage}`;
	},
	onRoleSelected: function(roleName){
		Auth.become(roleName).then(() => {
			return this.redirectToStartPage(roleName.toLowerCase());
		});
	},
	render: function(){
		const availableRoles = this.props.availableRoles;
		if(availableRoles.length > 1) {	// not drawing roles if there is only one. It will be selected automatically
			return <RSC availableRoles={availableRoles} onRoleSelected={this.onRoleSelected}/>;
		}
		return null;
	}
});

module.exports = RoleSelector;