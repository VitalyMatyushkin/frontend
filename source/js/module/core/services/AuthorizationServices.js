/**
 * Created by Anatoly on 10.04.2016.
 */

const   StorageHelper 	= require('module/helpers/storage'),
		Immutable   	= require('immutable'),
		Promise 		= require('bluebird');

/** Authorization Services */
const AuthorizationServices ={
    login: function(data){
        const   service = window.Server._login,
                binding = service.binding;
		return service.post(data).then(
			authData => {
				if(authData.key) {
					const authInfo = {
						id: authData.key,
						expireAt: authData.expireAt
					};
					if(authData.adminId)
						authInfo.adminId = authData.adminId;
					else
						authInfo.userId = authData.userId;
				
					binding.set(Immutable.fromJS(authInfo));
					if(authData.userId){
						return window.Server.roles.get().then(roles => {
							if(roles && roles.length == 1){
								return AuthorizationServices.become(roles[0].name);
							}
							else
								return AuthorizationServices.become('NOBODY');
						});
					}
				
				}
				
				return authData;
			},
			error => {
				console.log(`Login failed: \nResponse text: ${error.xhr.responseText} \nStatus: ${error.xhr.status} \nStatus text: ${error.xhr.statusText}`);
				return Promise.reject(error);
			});
    },
    become:function(roleName){
        const   service = window.Server._become,
                binding = service.binding;
		let authInfo;

		//console.log(binding.toJS());

		return service.post(roleName).then(authData => {
			console.log(authInfo);

			if(authData.key) {
				authInfo = {
					id			: authData.key,
					role		: authData.role,
					isBecome	: true,
					userId		: authData.userId,
					expireAt	: authData.expireAt
				};
			}

			/** Server not allow profile request before become */
			return window.Server.profile.get();
		}).then(profile => {
			/** save verification status */
			authInfo.verified = profile.verification && profile.verification.status;
			binding.set(Immutable.fromJS(authInfo));
			return authInfo;
		});
    },
	/** Clear authorization Info */
	clear:function(){
		const   service = window.Server._login,
				binding = service.binding;

		// clear authorizationInfo
		StorageHelper.cookie.remove('authorizationInfo');
		binding.clear();
	}
};

module.exports = AuthorizationServices;