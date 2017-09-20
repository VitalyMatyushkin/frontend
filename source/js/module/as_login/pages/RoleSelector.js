/**
 * Created by wert on 16.01.16.
 */
const	React			= require('react'),
		DomainHelper	= require('../../helpers/domain_helper'),
		Auth			= require('../../core/services/AuthorizationServices'),
		SchoolHelper	= require('module/helpers/school_helper'),
		RSC				= require('./RoleSelectorComponent');

const RoleSelector = React.createClass({
	propTypes: {
		availableRoles: React.PropTypes.array.isRequired
	},
	componentWillMount:function() {
		const availableRoles = this.props.availableRoles;

		if(availableRoles.length == 1) {
			DomainHelper.redirectToStartPage(
				availableRoles[0].name,
				this.getSchoolKindFromRole(availableRoles[0])
			);
		} else if(availableRoles.length === 0) {
			DomainHelper.redirectToStartPage(
				'no_body',
				undefined
			);
		}
	},
	onRoleSelected: function(role) {
		Auth.become(role.name);
	},
	/**
	 * Get first permission from role and get school kind from it.
	 * @param role
	 */
	getSchoolKindFromRole: function(role) {
		const	activeSchoolId		= SchoolHelper.getActiveSchoolId(this),
				activeSchoolIndex	= role.permissions.findIndex(permission => {
					return permission.schoolId === activeSchoolId;
				});

		return activeSchoolIndex === -1 ? role.permissions[0].school.kind : role.permissions[activeSchoolIndex].school.kind;
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