/**
 * Created by wert on 16.01.16.
 */
const React = require('react'),
	RoleHelper  = require('module/helpers/role_helper'),
	Auth = require('module/core/services/AuthorizationServices');

const RoleSelectorComponent = React.createClass({
	getRoleSubdomain: function(roleName) {
		return RoleHelper.roleMapper[roleName.toLowerCase()];
	},
	redirectToStartPage: function(roleName) {
		const self = this;

		const roleSubdomain = self.getRoleSubdomain(roleName);
		if(roleSubdomain) {
			let subdomains = document.location.host.split('.');
			subdomains[0] = roleSubdomain;
			const domain = subdomains.join(".");
			switch (roleSubdomain) {
				case 'manager':
					window.location.href = `//${domain}/#school_admin/summary`;
					break;
				case 'parents':
					window.location.href = `//${domain}/#events/calendar/all`;
					break;
			}
		} else {
			alert('unknown role: ' + roleName);
		}
	},
	onRoleSelected: function(roleName){
		const self = this;

		return function(){
			console.log(`Role selected: ${roleName}`);
			Auth.become(roleName).then(data => {
				return self.redirectToStartPage(roleName.toLowerCase());
			});
		}
	},
	renderRoleButton: function(roleName){
		const self = this;

		return <button key={roleName} onClick={self.onRoleSelected(roleName)}>{roleName}</button>
	},
	render: function(){
		const self = this;

		const availableRoles = self.props.availableRoles;
		if(availableRoles.length == 1) {
			self.redirectToStartPage(availableRoles[0]);
		}
		return (
			<div>
				{availableRoles.map(self.renderRoleButton)}
			</div>
		);
	}
});


module.exports = RoleSelectorComponent;
