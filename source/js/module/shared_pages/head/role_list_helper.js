const RoleListHelper = {
	getUserRoles: function () {
		return window.Server.roles.get().then(roles => {
			if (roles && roles.length) {
				const permissions = [];

				let isAlreadyHaveParentPermission = false;
				let isAlreadyHaveStudentPermission = false;

				roles.forEach(role => {
					role.permissions.forEach(permission => {
						// Always add all permissions besides PARENT and STUDENT permissions.
						// Add parent and student permissions only at once.
						switch (true) {
							case permission.preset === 'PARENT' && !isAlreadyHaveParentPermission:
								permission.role = role.name;
								permissions.push(permission);
								isAlreadyHaveParentPermission = true;
								break;
							case permission.preset === 'STUDENT' && !isAlreadyHaveStudentPermission:
								permission.role = role.name;
								permissions.push(permission);
								isAlreadyHaveStudentPermission = true;
								break;
							case permission.preset === 'PARENT' && isAlreadyHaveParentPermission:
								break;
							case permission.preset === 'STUDENT' && isAlreadyHaveStudentPermission:
								break;
							default:
								permission.role = role.name;
								permissions.push(permission);
						}
					});
				});

				return permissions;
			}
		});
	}
};

module.exports = RoleListHelper;