const PermissionsDetailsHelper = {
	getSchoolServiceFilter: function(schoolName, role) {
		const filter = {
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					},
					/* this param was added later, so it is undefined on some schools. Default value is true.
					 * undefined considered as 'true'. So, just checking if it is not explicitly set to false
					 */
					availableForRegistration: { $ne: false }
				},
				limit: 20,
				order: 'name ASC'
			}
		};

		switch (role) {
			case "admin":
				filter.filter.where.kind = {$in: ['School', 'SchoolUnion']};
				break;
			case "student":
				filter.filter.where.studentSelfRegistrationEnabled = true;
				break;
		}

		return filter;
	}
};

module.exports = PermissionsDetailsHelper;