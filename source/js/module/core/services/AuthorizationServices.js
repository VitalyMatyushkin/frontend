/**
 * Created by Anatoly on 10.04.2016.
 */

const	StorageHelper	= require('module/helpers/storage'),
		Immutable		= require('immutable'),
		SessionHelper	= require('module/helpers/session_helper'),
		Promise 		= require('bluebird');

/** Authorization Services */
const AuthorizationServices ={
	login: function(data){
		const	service			= window.Server._login,
				userDataBinding	= service.binding;

		return service.post(data).then(
			authData => {
				if(authData.key) {
					const authInfo = {
						id: authData.key,
						expireAt: authData.expireAt
					};

					if(authData.adminId) {
						authInfo.adminId = authData.adminId;
					} else {
						authInfo.userId = authData.userId;
					}

					SessionHelper.getLoginSessionBinding(
						userDataBinding
					).set(
						Immutable.fromJS(authInfo)
					);
					
					if(authData.userId) {
						return window.Server.profile.get().then(profile => {
							userDataBinding.set('userInfo',	Immutable.fromJS(profile));
							return window.Server.roles.get();
						}).then(roles => {
							if(roles && roles.length == 1) {
								return AuthorizationServices.become(roles[0].name);
							}
						});
					}
				
				}
				
				return authData;
			},
			error => {
				console.error(`Login failed: \nResponse text: ${error.xhr.responseText} \nStatus: ${error.xhr.status} \nStatus text: ${error.xhr.statusText}`);
				return Promise.reject(error);
			});
	},
	become:function(roleName){
		const	service			= window.Server._become,
 				userDataBinding	= service.binding;

		let		authInfo;

		return service.post(roleName).then(authData => {
			if(authData.key) {
				authInfo = {
					id			: authData.key,
					role		: authData.role,
					userId		: authData.userId,
					expireAt	: authData.expireAt
				};
			}

			/** Server not allow profile request before become */
			return window.Server.profile.get();
		}).then(profile => {
			/** save verification status */
			authInfo.verified = profile.verification && profile.verification.status;
			SessionHelper.getRoleSessionBinding(
				userDataBinding
			).set(
				Immutable.fromJS(authInfo)
			);
			return authInfo;
		});
    },
	/** Clear authorization Info */
	clear:function(){
		this.removeSessionsForStorages();
		this.setEmptyUserData();
	},
	/**
	 * Function removes sessions for storages
	 * - loginSession from cookie storage
	 * - roleSession from session storage
	 */
	removeSessionsForStorages: function () {
		StorageHelper.cookie.remove('loginSession');
		StorageHelper.SessionStorage.remove('roleSession');
	},
	/**
	 * Function set init state to userData binding
	 * That contain some user data like and user sessions
	 */
	setEmptyUserData: function () {
		const	service = window.Server._login,
				binding = service.binding;

		binding.set(
			Immutable.fromJS(
				{
					'sessions': SessionHelper.createSessionsObject(undefined,undefined)
				}
			)
		);
	}
};

module.exports = AuthorizationServices;