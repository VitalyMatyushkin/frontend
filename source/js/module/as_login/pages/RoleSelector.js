/**
 * Created by wert on 16.01.16.
 */
const	React	= require('react'),
		Auth	= require('../../core/services/AuthorizationServices'),
		RSC		= require('./RoleSelectorComponent');

const RoleSelector = React.createClass({
	propTypes: {
		availableRoles: React.PropTypes.array.isRequired
	},
	onRoleSelected: function(role) {
		Auth.become(role.name);
	},
	render: function() {
		const availableRoles = this.props.availableRoles;

		let content = null;

		// not drawing roles if there is only one. It will be selected automatically
		if(availableRoles.length > 1) {
			content = (
				<RSC
					availableRoles	= { availableRoles }
					onRoleSelected	= { this.onRoleSelected }
				/>
			);
		}

		return content;
	}
});

module.exports = RoleSelector;