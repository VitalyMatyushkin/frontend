const	DomainHelper	= require('module/helpers/domain_helper'),
		propz			= require('propz');

const authСontroller = {
	requestedPage: undefined,
	publicPages:['register', 'login', 'reset-request', 'reset'],
	initialize: function(options) {
		this.saveRequestedPage(options);
		this.initBinding(options);
		this.redirectUserByUserAuthData();

		this.binding.addListener('userData.authorizationInfo.id', this.handleUpdateUserAuthData.bind(this));
	},
	saveRequestedPage: function(options) {
		const isEmptyCurrentHash = document.location.hash === '';

		if(typeof options.requestedPage !== 'undefined') {
			this.requestedPage = options.requestedPage;
		} else if(
			!this.isPublicPage() &&
			!isEmptyCurrentHash
		) {
			this.requestedPage = document.location.hash;
		}
	},
	initBinding: function(options) {
		this.binding = options.binding;
	},
	redirectUserByUserAuthData: function() {
		const	binding					= this.binding;

		const	isRegistrationProcess	= binding.get('form.register.formFields'), //user not in registration process now
				isUserAuth				= this.isUserAuth(),
				isUserOnRole			= this.isUserOnRole(),
				isSuperAdmin			= this.isSuperAdmin();

		if(!isRegistrationProcess) {								// When user isn't in registration process
			if (isSuperAdmin) {										// For superadmin
				if(typeof this.requestedPage === 'undefined') {
					this.redirectToDefaultPageForSuperAdmin();
				} else {
					this.redirectToRequestedPage();
				}
			} else if(												//Bypass authentication
				this.requestedPage === 'loginPublicSchool' ||
				this.requestedPage === 'home'
			) {
				window.location.hash = this.requestedPage;
			} else if (												// When user is log in but doesn't have role
				isUserAuth &&
				!isUserOnRole
			) {
				// TODO i think it should be looks something else
				// But now just don't do anything
				// This case is processed by router
				console.log('');
			} else if (isUserOnRole) {								// When user under some role
				if (typeof this.requestedPage === 'undefined') {
					this.redirectToDefaultPage();
				} else {
					this.redirectToRequestedPage();
				}
			} else if(!this.isPublicPage()) {						// When user isn't log in, and it's not a public page
				window.location.href = DomainHelper.getLoginUrl();
			}
		}
	},
	/**
	 * Function returns true when user has authenticated
	 * @returns {boolean}
	 */
	isUserAuth: function() {
		const	binding		= this.binding,
				data		= binding.toJS('userData.authorizationInfo');

		const id = propz.get(data, ['id']);

		return typeof id !== 'undefined';
	},
	/**
	 * Function returns true when user has been authorized
	 * @returns {boolean}
	 */
	isUserOnRole: function() {
		const	binding		= this.binding,
				data		= binding.toJS('userData.authorizationInfo');

		const	isBecome	= propz.get(data, ['isBecome']),
				role		= propz.get(data, ['role']);

		return	this.isUserAuth() &&
				this.isRoleListExist() &&
				typeof isBecome !== 'undefined' &&
				typeof role !== 'undefined';
	},
	/**
	 * Function returns true when user is Super Admin
	 * @returns {boolean}
	 */
	isSuperAdmin: function() {
		const	binding		= this.binding,
				data		= binding.toJS('userData.authorizationInfo');

		const adminId = propz.get(data, ['adminId']);

		return typeof adminId !== 'undefined';
	},
	/**
	 * Function returns true when current page is one from public pages
	 * @returns {boolean}
	 */
	isPublicPage: function() {
		var self = this,
			path = document.location.hash;

		return self.publicPages.some(value => {return path.indexOf(value) !== -1});
	},
	/**
	 * Function redirects to requested page and clear field requested page
	 */
	redirectToRequestedPage: function() {
		const requestedPage = String(this.requestedPage);
		this.requestedPage = undefined;

		window.location.hash = requestedPage;
		// TODO it's a little hack for case when user redirect to page same us current page
		window.location.reload();
	},
	/**
	 * Function redirects to page default for current user role.
	 */
	redirectToDefaultPage: function() {
		const	binding		= this.binding,
				data		= binding.toJS('userData.authorizationInfo');

		window.location.hash = DomainHelper.getDefaultPageByRoleNameAndSchoolKind(
			data.role.toLowerCase(),
			this.getSchoolKind(data.role, binding.toJS('userData'))
		);
		// TODO it's a little hack for case when user redirect to page same us current page
		window.location.reload();
	},
	/**
	 * Function redirects to page default for superadmin.
	 */
	redirectToDefaultPageForSuperAdmin: function() {
		window.location.hash = 'admin_schools';
		// TODO it's a little hack for case when user redirect to page same us current page
		window.location.reload();
	},
	getSchoolKind: function(role) {
		const	binding = this.binding;
		let		schoolKind;

		if(this.isFirstLogin()) {
			schoolKind = this.getRandomSchoolKindByRole(role);
		} else {
			schoolKind = this.getSchoolKindByRoleAndSchoolId(
				role,
				binding.toJS('userRules.activeSchoolId')
			);
		}

		return schoolKind;
	},
	getSchoolKindByRoleAndSchoolId: function(role, schoolId) {
		const	binding = this.binding;
		let		schoolKind;

		const permissions = propz.get(binding.toJS('userData'), ['roleList', 'permissions']);
		if(typeof permissions !== 'undefined') {
			const permission = permissions.find(p => p.role === role && p.schoolId === schoolId);

			if(typeof permission !== 'undefined') {
				schoolKind = permission.school.kind;
			}
		}

		return schoolKind;
	},
	/**
	 * Functions returns school kind for current role from first active permission
	 * which from permission list for current role
	 * @param role
	 * @param userData
	 * @returns {undefined}
	 */
	getRandomSchoolKindByRole: function(role) {
		const	binding = this.binding;
		let		schoolKind;

		const	permissionsData	= binding.toJS('userData.__allPermissions').find(data => data.name === role),
				permissions		= propz.get(permissionsData, ['permissions']);

		if(typeof permissions !== 'undefined') {
			const permission = permissions.find(item => item.status === 'ACTIVE');

			if(typeof permission !== 'undefined') {
				schoolKind = permission.school.kind;
			}
		}

		return schoolKind;
	},
	isRoleListExist: function() {
		const binding = this.binding;

		return (
			typeof propz.get(binding.toJS('userData'), ['__allPermissions']) !== 'undefined' ||
			typeof propz.get(binding.toJS('userData'), ['roleList']) !== 'undefined'
		);
	},
	isFirstLogin: function() {
		return typeof propz.get(this.binding.toJS('userData'), ['roleList']) === 'undefined';
	},
	/**
	 * Handler for user auth update event
	 */
	handleUpdateUserAuthData: function() {
		this.redirectUserByUserAuthData();
	}
};

module.exports = authСontroller;