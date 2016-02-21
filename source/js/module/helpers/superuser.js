/**
 * Created by wert on 19.11.15.
 */

const Lazy          = require('lazyjs'),
      Immutable 	= require('immutable');

function runAsSuperUser(rootBinding, cb) {
    loginAsSuperUser(rootBinding, function() {
        cb(function() {
            logout(rootBinding);
        });
    });
};

function loginAsSuperUser(rootBinding, cb) {
    window.Server.login.post({username:"superadmin",password:"superadmin"}).then(function(data) {
        rootBinding.update('userData.authorizationInfo', function(){
            return Immutable.fromJS({
                id:             data.id,
                ttl:            data.ttl,
                userId:         data.userId,
                verified:       data.user.verified,
                registerType:   data.user.registerType
            });
        });

        cb();
    });
};

function logout(rootBinding) {
    rootBinding.update('userData.authorizationInfo', function(){
        return Immutable.fromJS({});
    });
};

const Superuser = {
    runAsSuperUser:     runAsSuperUser,
    loginAsSuperUser:   loginAsSuperUser,
    logout:             logout
};

module.exports = Superuser;
