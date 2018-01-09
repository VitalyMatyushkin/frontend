/**
 * Created by Anatoly on 10.04.2016.
 */

import * as Immutable from 'immutable'
import * as SessionHelper from 'module/helpers/session_helper'
import * as StorageHelper from 'module/helpers/storage'
import * as BPromise from 'bluebird'
import {Role} from "module/models/role/role";

/** Authorization Services */
export const AuthorizationServices ={
	login(data) {
		const service = (window as any).Server._login;
		const userDataBinding = service.binding;

		return service.post(data).then(authData => {
				if(authData.key) {
					const authInfo = {
						id: authData.key,
						expireAt: authData.expireAt,
						adminId: undefined,
						userId: undefined
					};

					if(authData.adminId) {
						authInfo.adminId = authData.adminId;
					} else {
						authInfo.userId = authData.userId;
					}
					
					SessionHelper.getLoginSessionBinding(userDataBinding).set(Immutable.fromJS(authInfo));
					
					if(authData.userId) {
						return (window as any).Server.profile.get().then(profile => {
							userDataBinding.set('userInfo',	Immutable.fromJS(profile));
							SessionHelper.getLoginSessionBinding(userDataBinding).sub('email').set(profile.email);
							SessionHelper.getLoginSessionBinding(userDataBinding).sub('phone').set(profile.phone);
							SessionHelper.getLoginSessionBinding(userDataBinding).sub('verified').set(Immutable.fromJS(
								{
								"email":	profile.verification.status.email,
								"sms":		profile.verification.status.sms,
								"personal":	profile.verification.status.personal
								}
							));
							return (window as any).Server.roles.get();
						}).then((roles: Role[]) => {
							if(roles && roles.length == 1) {
								return AuthorizationServices.become(roles[0].name);
							}
						});
					}
				
				}
				
				return authData;
			},
			error => {
				console.error(
					`Login failed: \nResponse text: ${error.xhr.responseText} \nStatus: ${error.xhr.status} \nStatus text: ${error.xhr.statusText}`
				);

				return BPromise.reject(error);
			});
	},
	become(roleName) {
		const service = (window as any).Server._become;
 		const userDataBinding = service.binding;

		let authInfo;

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
			return (window as any).Server.profile.get();
		}).then(profile => {
			/** save verification status */
			authInfo.verified = profile.verification && profile.verification.status;

			SessionHelper.getRoleSessionBinding(userDataBinding).set(Immutable.fromJS(authInfo));
			return authInfo;
		});
    },
	/** Clear authorization Info */
	clear() {
		this.removeSessionsForStorages();
		this.setEmptyUserData();
	},
	/**
	 * Function removes sessions for storages
	 * - loginSession from cookie storage
	 * - roleSession from session storage
	 */
	removeSessionsForStorages() {
		StorageHelper.cookie.remove('loginSession');
		StorageHelper.SessionStorage.remove('roleSession');
	},
	/**
	 * Function set init state to userData binding
	 * That contain some user data like and user sessions
	 */
	setEmptyUserData() {
		const service = (window as any).Server._login;
		const binding = service.binding;

		binding.set(Immutable.fromJS({'sessions': SessionHelper.createSessionsObject(undefined,undefined)}));
	}
};