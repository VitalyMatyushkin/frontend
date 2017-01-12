const RoleHelper = {
	roleMapper: {
		owner:		'app',
		admin:		'app',
		manager:	'app',
		teacher:	'app',
		trainer:	'app',
		parent:		'app',
		no_body:	'app'// it's a synthetic role, it isn't exist on server
	},
	ALLOWED_PERMISSION_PRESETS: {
		ADMIN:		'ADMIN',
		MANAGER:	'MANAGER',
		TEACHER:	'TEACHER',
		COACH:		'COACH',
		STUDENT:	'STUDENT',
		PARENT:		'PARENT'
	},
	SERVER_ROLE_FOR_CLIENT:{
		ADMIN:		'ADMIN',
		MANAGER:	'MANAGER',
		TEACHER:	'TEACHER',
		TRAINER:	'COACH',
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
	isUserSchoolWorker: function(self) {
		const role = this.getLoggedInUserRole(self);

		return role === this.ALLOWED_PERMISSION_PRESETS.ADMIN || role === this.ALLOWED_PERMISSION_PRESETS.MANAGER ||
			role === this.ALLOWED_PERMISSION_PRESETS.TEACHER || role === this.ALLOWED_PERMISSION_PRESETS.COACH;
	},
	isParent: function(self) {
		const role = this.getLoggedInUserRole(self);

		return role === this.ALLOWED_PERMISSION_PRESETS.PARENT;
	}
};

module.exports = RoleHelper;