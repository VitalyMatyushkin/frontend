const RoleHelper = {
	roleMapper: {
		owner:		'manager',
		admin:		'manager',
		manager:	'manager',
		teacher:	'manager',
		trainer:	'manager',
		parent:		'parents'
	},
	ALLOWED_PERMISSION_PRESETS: {
		ADMIN:		'ADMIN',
		MANAGER:	'MANAGER',
		TEACHER:	'TEACHER',
		COACH:		'TRAINER',
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