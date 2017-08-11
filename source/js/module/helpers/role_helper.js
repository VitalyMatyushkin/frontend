const RoleHelper = {
	roleMapper: {
		owner:		'app',
		admin:		'app',
		manager:	'app',
		teacher:	'app',
		coach:		'app',
		parent:		'app',
		student:	'app',
		no_body:	'app'// it's a synthetic role, it isn't exist on server
	},
	USER_ROLES: {
		ADMIN:		'ADMIN',
		MANAGER:	'MANAGER',
		TEACHER:	'TEACHER',
		COACH:		'COACH',
		STUDENT:	'STUDENT',
		PARENT:		'PARENT'
	},
	USER_PERMISSIONS: {
		ADMIN:		'ADMIN',
		MANAGER:	'MANAGER',
		TEACHER:	'TEACHER',
		COACH:		'COACH',
		STUDENT:	'STUDENT',
		PARENT:		'PARENT'
	},
	ROLE_TO_PERMISSION_MAPPING:{
		ADMIN:		'ADMIN',
		MANAGER:	'MANAGER',
		TEACHER:	'TEACHER',
		COACH:		'COACH',
		STUDENT:	'STUDENT',
		PARENT:		'PARENT'
	},
	/**
	 * Return role of logged in user
	 * @param self
	 * @returns {*}
	 */
	getLoggedInUserRole: function(self) {
		return self.getMoreartyContext().getBinding().get('userData.roleList.activePermission.role');
	},
	getActiveSchoolKind: function(self) {
		return self.getMoreartyContext().getBinding().get('userData.roleList.activePermission.school.kind');
	},
	isUserSchoolWorker: function(self) {
		const role = this.getLoggedInUserRole(self);

		return role === this.USER_ROLES.ADMIN || role === this.USER_ROLES.MANAGER ||
			role === this.USER_ROLES.TEACHER || role === this.USER_ROLES.COACH;
	},
	isParent: function(self) {
		const role = this.getLoggedInUserRole(self);

		return role === this.USER_ROLES.PARENT;
	},
	isStudent: function(self) {
		const role = this.getLoggedInUserRole(self);

		return role === this.USER_ROLES.STUDENT;
	}
};

module.exports = RoleHelper;