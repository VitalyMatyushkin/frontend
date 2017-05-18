const	DomainHelper	= require('module/helpers/domain_helper'),
		propz			= require('propz');

const authСontroller = {
	requestedPage: undefined,
	publicPages:['register', 'login', 'reset-request', 'reset'],
	initialize: function(options) {
		this.saveRequestedPage(options);
		this.initBinding(options);
		this.redirectUserByUserAuthData();

		this.binding.addListener('userData.authorizationInfo', this.handleUpdateUserAuthData.bind(this));
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
				isUserAuth	= this.isUserAuth(),
				isUserOnRole				= this.isUserOnRole(),
				isSuperAdmin			= this.isSuperAdmin();

		if(!isRegistrationProcess) {								// When user isn't in registration process
			if (isSuperAdmin) {										// For superadmin
				if(typeof this.requestedPage === 'undefined') {
					this.redirectToDefaultPageForSuperAdmin();
				} else {
					this.redirectToRequestedPage();
				}
			} else if (												// When user is log in but doesn't have role
				isUserAuth &&
				!isUserOnRole
			) {
				// TODO i think it should be looks something else
				// But now just don't do anything
				// This case is processed by router
				console.log('');
			} else if (isUserOnRole) {								// When user under some role
				if(typeof this.requestedPage === 'undefined') {
					this.redirectToDefaultPage();
				} else {
					this.redirectToRequestedPage();
				}
			} else if(this.requestedPage === 'loginPublicSchool' || this.requestedPage === 'home') {
				window.location.hash = this.requestedPage;			//Bypass authentication
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
	},
	/**
	 * Function redirects to page default for superadmin.
	 */
	redirectToDefaultPageForSuperAdmin: function() {
		window.location.hash = 'admin_schools';
	},
	/**
	 * Functions returns school kind for current role from first active permission
	 * which from permission list for current role
	 * @param role
	 * @param userData
	 * @returns {undefined}
	 */
	getSchoolKind: function(role, userData) {
		let schoolKind = undefined;

		const permissionsData = userData.__allPermissions.find(data => data.name === role);
		if(typeof permissionsData !== 'undefined' && typeof permissionsData.permissions !== 'undefined') {
			const permission = permissionsData.permissions.find(item => item.status === 'ACTIVE');

			if(typeof permission !== 'undefined') {
				schoolKind = permission.school.kind;
			}
		}

		return schoolKind;
	},
	/**
	 * Handler for user auth update event
	 */
	handleUpdateUserAuthData: function() {
		this.redirectUserByUserAuthData();
	}
};

module.exports = authСontroller;