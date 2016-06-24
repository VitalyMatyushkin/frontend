/**
 * Created by wert on 16.01.16.
 */
const 	React 		= require('react'),
		RoleHelper  = require('module/helpers/role_helper'),
		Auth 		= require('module/core/services/AuthorizationServices');

const RoleSelectorComponent = React.createClass({
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

		return <div className="bButton" key={roleName} onClick={self.onRoleSelected(roleName)}>{roleName}</div>
	},
	render: function(){
		const self = this;

		return (
			<div className="bRoleSelector">
				{self.props.availableRoles.map(self.renderRoleButton)}
			</div>
		);
	}
});


module.exports = RoleSelectorComponent;
