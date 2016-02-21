/**
 * Created by wert on 19.11.15.
 */

const   Lazy        = require('lazyjs'),
        Immutable 	= require('immutable'),
        Promise     = require('bluebird');

function runAsSuperUser(rootBinding, toRun) {
    loginAsSuperUser(rootBinding)
        .then( toRun )
        .finally(() => logout(rootBinding));
}

function loginAsSuperUser(rootBinding) {
    return window.Server.login.post({username:"superadmin",password:"superadmin"}).then((data) => {
        rootBinding.set('userData.authorizationInfo', Immutable.fromJS({
            id:             data.id,
            ttl:            data.ttl,
            userId:         data.userId,
            verified:       data.user.verified,
            registerType:   data.user.registerType
        }));
        return true;    // just saying that everything is true :)
    });
}

function logout(rootBinding) {
    rootBinding.set('userData.authorizationInfo', Immutable.fromJS({}));
}

const Superuser = {
    runAsSuperUser:     runAsSuperUser,
    loginAsSuperUser:   loginAsSuperUser,
    logout:             logout
};

module.exports = Superuser;
