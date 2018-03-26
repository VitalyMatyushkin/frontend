import * as Immutable from  'immutable';
import * as BPromise from  'bluebird';

import {AuthorizationServices} from  'module/core/services/AuthorizationServices';
import * as DomainHelper from 'module/helpers/domain_helper';
import * as SessionHelper from 'module/helpers/session_helper';
import * as RoleListHelper from 'module/shared_pages/head/role_list_helper';
import * as UserInfoHelper from 'module/shared_pages/head/user_info_helper';

import * as propz from  'propz';
import {ServiceList} from "module/core/service_list/service_list";

export const authController = {
	requestedPage: undefined,
	publicPages: ['register', 'login', 'reset-request', 'reset'],
	asPublicSchool: false,
	asBigscreen: false,

	initialize(options) {
		this.saveRequestedPage();
		this.initBinding(options);

		if(options.asPublicSchool) {
			this.asPublicSchool = options.asPublicSchool;
		}

		if(options.asBigscreen) {
			this.asBigscreen = options.asBigscreen;
		}

		let initPromises = [];

		if(this.isUserAuth() && !this.isSuperAdmin()) {
			initPromises.push(this.setUserInfo());
			initPromises.push(this.setRoleList());
		}
		if(this.hasUserOnlyOneLoginRole() && !this.isSuperAdmin()) {
			initPromises.push(this.becomeOneRole());
		}

		return BPromise.all(initPromises).then(() => {
			SessionHelper.getSessionsDataBinding(
				this.binding.sub('userData')
			).addListener(this.handleUpdateUserAuthData.bind(this));

			return true;
		});
	},
	hasUserOnlyOneLoginRole() {
		return (
			typeof SessionHelper.getLoginSession(this.binding.sub('userData')) !== 'undefined' &&
			typeof SessionHelper.getRoleSession(this.binding.sub('userData')) === 'undefined'
		);
	},
	setUserInfo() {
		return UserInfoHelper
			.getUserInfo()
			.then(profile => {
				this.binding.set(
					'userData.userInfo',
					Immutable.fromJS(profile)
				);
				
				return true;
			});
	},
	setRoleList() {
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
	becomeOneRole() {
		return (window.Server as ServiceList).roles.get().then(roles => {
				if(roles[0] && roles.length == 1) {
					return AuthorizationServices.become(roles[0].name);
				} else {
					return BPromise.resolve(true);
				}
			});
	},
	saveRequestedPage() {
		const isEmptyCurrentHash = document.location.hash === '';

		if(!this.isPublicPage() && !isEmptyCurrentHash) {
			this.requestedPage = document.location.hash;
		}
	},
	initBinding(options) {
		this.binding = options.binding;
	},
	redirectUserByUserAuthData() {
		const	binding					= this.binding,
				isRegistrationProcess	= binding.get('form.register.formFields'), //user not in registration process now
				isUserAuth				= this.isUserAuth(),
				isUserOnRole			= this.isUserOnRole(),
				isSuperAdmin			= this.isSuperAdmin();

		if(!isRegistrationProcess) {								// When user isn't in registration process
			switch (true) {
				case isSuperAdmin === true: {
					this.redirectToDefaultPageForSuperAdmin();
					break;
				}
				case this.asPublicSchool === true: {
					// redirect to loginPublicSchool
					window.location.hash = 'loginPublicSchool';

					binding.set('loginPublicSchool.hashOfRedirectPageAfterLogin', this.requestedPage);
					this.requestedPage = undefined;
					break;
				}
				case this.asBigscreen === true: {
					// redirect to loginPublicBigscreen
					window.location.hash = 'loginPublicBigscreen';

					binding.set('loginPublicBigscreen.hashOfRedirectPageAfterLogin', this.requestedPage);
					this.requestedPage = undefined;
					break;
				}
				// When user is log in but doesn't have role
				case (isUserAuth && !isUserOnRole && !this.isSettingsVerificationPage()): {
					window.location.href = DomainHelper.getLoginUrl();
					// Remove old requested page for case when user change role
					// i don't know why but it must be here
					this.requestedPage = undefined;
					break;
				}
				case (isUserOnRole === true): {
					if (typeof this.requestedPage === 'undefined') {
						this.redirectToDefaultPage();
					} else {
						this.redirectToRequestedPage();
					}
					break;
				}
				case (!this.isPublicPage() && !this.isSettingsVerificationPage()): {
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
	isUserAuth() {
		const binding = this.binding;

		const loginSession = SessionHelper.getLoginSession(
			binding.sub('userData')
		);

		const id = propz.get(loginSession, ['id'], undefined);

		return typeof id !== 'undefined';
	},
	/**
	 * Function returns true when user has been authorized
	 * @returns {boolean}
	 */
	isUserOnRole() {
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
	isSuperAdmin() {
		const binding = this.binding;

		const loginSession = SessionHelper.getLoginSession(
			binding.sub('userData')
		);

		const adminId = propz.get(loginSession, ['adminId'], undefined);

		return typeof adminId !== 'undefined';
	},
	/**
	 * Function returns true when current page is one from public pages
	 * @returns {boolean}
	 */
	isPublicPage() {
		const path = window.location.hash;

		return this.publicPages.some(value => {return path.indexOf(value) !== -1});
	},
	isSettingsVerificationPage() {
		const path = window.location.hash;

		return path === '#settings/verification';
	},
	/**
	 * Function redirects to requested page and clear field requested page
	 */
	redirectToRequestedPage() {
		const requestedPage = String(this.requestedPage);
		this.requestedPage = undefined;

		window.location.hash = requestedPage;
	},
	/**
	 * Function redirects to page default for current user role.
	 */
	redirectToDefaultPage() {
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
	redirectToDefaultPageForSuperAdmin() {
		window.location.hash = 'users/users';

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
	getSchoolKindByRoleAndSchoolId(role, schoolId) {
		const binding = this.binding;
		let schoolKind;

		const permissions = propz.get(binding.toJS('userData'), ['roleList', 'permissions'], undefined);
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
		const binding = this.binding;
		let schoolKind;

		const permissions = propz.get(binding.toJS(), ['userData', 'roleList', 'permissions'], undefined);

		if(typeof permissions !== 'undefined') {
			const permission = permissions.find(item => item.role === role && item.status === 'ACTIVE');

			if(typeof permission !== 'undefined') {
				schoolKind = permission.school.kind;
			}
		}

		return schoolKind;
	},
	isRoleListExist() {
		const binding = this.binding;

		return (
			typeof propz.get(binding.toJS('userData'), ['roleList'], undefined) !== 'undefined'
		);
	},
	isUserInSystem() {
		const activeSchoolId = propz.get(this.binding.toJS('userRules'), ['activeSchoolId'], undefined);

		// sometimes activeSchoolId is null
		const isActiveSchoolExist = typeof activeSchoolId === 'string';

		return isActiveSchoolExist;
	},
	/**
	 * Handler for user auth update event
	 */
	handleUpdateUserAuthData() {
		this.redirectUserByUserAuthData();
	}
};