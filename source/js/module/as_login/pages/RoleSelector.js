/**
 * Created by wert on 16.01.16.
 */
const	React	= require('react'),
		Auth	= require('../../core/services/AuthorizationServices'),
		RSC		= require('./RoleSelectorComponent');

const RoleSelector = React.createClass({
	propTypes: {
		roleList: React.PropTypes.array.isRequired
	},
	onRoleSelected: function(roleName) {
		Auth.become(roleName);
	},
	render: function() {
		const roleList = this.props.roleList;

		let content = null;

		// not drawing roles if there is only one. It will be selected automatically
		if(roleList.length > 1) {
			content = (
				<RSC
					roleList		= { roleList }
					onRoleSelected	= { this.onRoleSelected }
				/>
			);
		}

		return content;
	}
});

module.exports = RoleSelector;