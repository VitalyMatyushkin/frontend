/**
 * Created by wert on 16.01.16.
 */
const 	React 			= require('react'),
		DomainHelper	= require('../../helpers/domain_helper'),
		Auth 			= require('../../core/services/AuthorizationServices'),
		RSC				= require('./RoleSelectorComponent');

const RoleSelector = React.createClass({
	componentWillMount:function(){
		const self = this;
		const availableRoles = self.props.availableRoles;

		if(availableRoles.length == 1) {
			DomainHelper.redirectToStartPage(availableRoles[0]);
		}
		if(availableRoles.length === 0){
			DomainHelper.redirectToStartPage('no_body');
		}
	},
	onRoleSelected: function(roleName){
		Auth.become(roleName).then(() => {
			return DomainHelper.redirectToStartPage(roleName);
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