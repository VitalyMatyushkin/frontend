const	DomainHelper			= require('module/helpers/domain_helper'),
		SessionHelper			= require('module/helpers/session_helper'),
		AuthorizationServices	= require('module/core/services/AuthorizationServices'),
		RoleListHelper			= require('module/shared_pages/head/role_list_helper'),
		Immutable 				= require('immutable'),
		Promise 				= require('bluebird'),
		propz					= require('propz');

const authСontroller = {
	requestedPage:	undefined,
	publicPages:	['register', 'login', 'reset-request', 'reset'],
	asPublicSchool:	false,
	initialize: function(options) {
		this.saveRequestedPage();
		this.initBinding(options);

		if(options.asPublicSchool) {
			this.asPublicSchool = options.asPublicSchool;
		}

		let initPromises = [];
		if(this.isUserAuth()) {
			initPromises.push(this.setRoleList());
		}
		if(this.hasUserOnlyOneLoginRole()) {
			initPromises.push(this.becomeOneRole());
		}

		return Promise.all(initPromises).then(() => {
			SessionHelper.getSessionsDataBinding(
				this.binding.sub('userData')
			).addListener(this.handleUpdateUserAuthData.bind(this));

			return true;
		});
	},
	hasUserOnlyOneLoginRole: function () {
		return (
			typeof SessionHelper.getLoginSession(this.binding.sub('userData')) !== 'undefined' &&
			typeof SessionHelper.getRoleSession(this.binding.sub('userData')) === 'undefined'
		);
	},
	setRoleList: function () {
		return RoleListHelper
			.getUserRoles()
			.then(permissions => {
				this.binding.set(
					'userData.roleList',
					Immutable.fromJS({
						permissions: permissions
					})
				);

				return true;
			});
	},
	/**
	 * Function gets user role session if user has one role
	 */
	becomeOneRole: function () {
		return window.Server.roles.get()
			.then(roles => {
				if(roles && roles.length == 1) {
					return AuthorizationServices.become(roles[0].name);
				} else {
					return Promise.resolve(true);
				}
			});
	},
	saveRequestedPage: function() {
		const isEmptyCurrentHash = document.location.hash === '';

		if(
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
			switch (true) {
				case (isSuperAdmin): {
					this.redirectToDefaultPageForSuperAdmin();
					break;
				}
				case (this.asPublicSchool): {
					// redirect to loginPublicSchool
					window.location.hash = 'loginPublicSchool';

					binding.set('loginPublicSchool.hashOfRedirectPageAfterLogin', this.requestedPage);
					this.requestedPage = undefined;
					break;
				}
				// When user is log in but doesn't have role
				case (
					isUserAuth &&
					!isUserOnRole
				): {
					window.location.href = DomainHelper.getLoginUrl();
					// Remove old requested page for case when user change role
					// i don't know why but it must be here
					this.requestedPage = undefined;
					break;
				}
				case (isUserOnRole): {
					if (typeof this.requestedPage === 'undefined') {
						this.redirectToDefaultPage();
					} else {
						this.redirectToRequestedPage();
					}
					break;
				}
				case (!this.isPublicPage()): {
					window.location.href = DomainHelper.getLoginUrl();
					break;
				}
			}
		}
	},
	/**
	 * Function returns true when user has authenticated
	 * @returns {boolean}
	 */
	isUserAuth: function() {
		const binding = this.binding;

		const loginSession = SessionHelper.getLoginSession(
			binding.sub('userData')
		);

		const id = propz.get(loginSession, ['id']);

		return typeof id !== 'undefined';
	},
	/**
	 * Function returns true when user has been authorized
	 * @returns {boolean}
	 */
	isUserOnRole: function() {
		const binding = this.binding;

		const hasUserRole = typeof SessionHelper.getRoleSession(binding.sub('userData')) !== 'undefined';

		return	this.isUserAuth() &&
				this.isRoleListExist() &&
				hasUserRole;
	},
	/**
	 * Function returns true when user is Super Admin
	 * @returns {boolean}
	 */
	isSuperAdmin: function() {
		const binding = this.binding;

		const loginSession = SessionHelper.getLoginSession(
			binding.sub('userData')
		);

		const adminId = propz.get(loginSession, ['adminId']);

		return typeof adminId !== 'undefined';
	},
	/**
	 * Function returns true when current page is one from public pages
	 * @returns {boolean}
	 */
	isPublicPage: function() {
		const	self	= this,
				path	= window.location.hash;

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
		const binding = this.binding;

		const roleSession = SessionHelper.getRoleSession(
			binding.sub('userData')
		);

		if(typeof roleSession !== 'undefined') {
			let role = SessionHelper.getRoleFromSession(
				binding.sub('userData')
			);
			if(typeof role === 'undefined') {
				role = 'no_body';
			}

			const defaultPageHash = DomainHelper.getDefaultPageByRoleNameAndSchoolKind(
				role,
				this.getSchoolKind(role)
			);

			window.location.hash = defaultPageHash;

			// just in case
			this.requestedPage = undefined;
		} else {
			console.error('ERROR: There is no role session.');
		}
	},
	/**
	 * Function redirects to page default for superadmin.
	 */
	redirectToDefaultPageForSuperAdmin: function() {
		window.location.hash = 'users';

		// just in case
		this.requestedPage = undefined;
	},
	getSchoolKind: function(role) {
		let schoolKind;

		if(this.isUserInSystem()) {
			schoolKind = this.getSchoolKindByRoleAndSchoolId(
				role,
				this.binding.toJS('userRules.activeSchoolId')
			);
		} else {
			schoolKind = this.getRandomSchoolKindByRole(role)
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

		const permissions = propz.get(binding.toJS(), ['userData', 'roleList', 'permissions']);

		if(typeof permissions !== 'undefined') {
			const permission = permissions.find(item => item.role === role && item.status === 'ACTIVE');

			if(typeof permission !== 'undefined') {
				schoolKind = permission.school.kind;
			}
		}

		return schoolKind;
	},
	isRoleListExist: function() {
		const binding = this.binding;

		return (
			typeof propz.get(binding.toJS('userData'), ['roleList']) !== 'undefined'
		);
	},
	isUserInSystem: function() {
		const activeSchoolId = propz.get(this.binding.toJS('userRules'), ['activeSchoolId']);
		// sometimes activeSchoolId is null
		const isActiveSchoolExist = typeof activeSchoolId === 'string';

		return isActiveSchoolExist;
	},
	/**
	 * Handler for user auth update event
	 */
	handleUpdateUserAuthData: function() {
		this.redirectUserByUserAuthData();
	}
};

module.exports = authСontroller;