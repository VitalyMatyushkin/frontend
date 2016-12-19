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
	getDomainNameByRole: function(role) {
		// parse domains from domain name to array
		// app.squard.com => ['app', 'squard', 'com']
		const domains = document.location.host.split('.');
		// Third level domain is "0" index in array
		domains[0] = this.getThirdLevelDomainByRole(role);

		return domains.join(".");
	},
	getThirdLevelDomainByRole: function(role) {
		return RoleHelper.roleMapper[role.toLowerCase()];
	},
	getDefaultPageByRoleName: function(roleName) {
		switch (roleName) {
			case 'owner':
				return `school_admin/summary`;
			case 'admin':
				return `school_admin/summary`;
			case 'manager':
				return `school_admin/summary`;
			case 'teacher':
				return `school_admin/summary`;
			case 'trainer':
				return `school_admin/summary`;
			case 'parent':
				return `events/calendar/all`;
			case 'no_body':
				return `settings/general`;
		}
	},
	redirectToStartPage: function(role) {
		const	domainName	= this.getDomainNameByRole(role),
				defaultPage	= this.getDefaultPageByRoleName(role);

		window.location.href = `//${domainName}/#${defaultPage}`;
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