/**
 * Created by Anatoly on 10.04.2016.
 */

const   Immutable   = require('immutable'),
        Promise     = require('bluebird');

const AuthorizationServices ={
    login: function(data){
        const   service = window.Server._login,
                binding = service.binding;

        return service.post(data).then(authData => {
            if(authData.key) {
                const authorizationInfo = {
                    id: authData.key,
                    expireAt: authData.expireAt,
                    verified: {"email":true,"phone":true,"personal":true}//,
                    //registerType: data.user.registerType
                };
                if(authData.adminId)
                    authorizationInfo.adminId = authData.adminId;
                else
                    authorizationInfo.userId = authData.userId;

                binding.set(Immutable.fromJS(authorizationInfo));

                if(authData.userId){
                    return window.Server.roles.get().then(roles => {
                        if(roles && roles.length){
                            return AuthorizationServices.become(roles[0].name);
                        }
                        return null;
                    });

                }
            }

            return authData;
        });
    },
    become:function(roleName){
        const   service = window.Server._become,
                binding = service.binding;


        return service.post(roleName).then(authData => {
            if(authData.key) {
                const authorizationInfo = {
                    id: authData.key,
                    role:authData.role,
                    userId:authData.userId,
                    expireAt: authData.expireAt,
                    verified: {"email":true,"phone":true,"personal":true}//,
                    //registerType: data.user.registerType
                };

                binding.set(Immutable.fromJS(authorizationInfo));
            }

            return authData;
        });
    }
};

module.exports = AuthorizationServices;