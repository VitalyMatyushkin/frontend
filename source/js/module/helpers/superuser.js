/**
 * Created by wert on 19.11.15.
 */

const	Immutable		= require('immutable'),
		SessionHelper	= require('module/helpers/session_helper');

function runAsSuperUser(rootBinding, toRun) {
	loginAsSuperUser(rootBinding)
		.then( toRun )
	.finally(() => logout(rootBinding));
}

function loginAsSuperUser(rootBinding) {
	return window.Server._login.post({email:"superadmin@squadintouch.com",password:"superadmin"}).then((data) => {

		SessionHelper.getLoginSessionBinding(
			rootBinding.sub('userData')
		).set(
			Immutable.fromJS({
				id:             data.id,
				ttl:            data.ttl,
				userId:         data.userId,
				verified:       data.user.verified,
				registerType:   data.user.registerType
			})
		);

		return true;// just saying that everything is true :)
	});
}

function logout(rootBinding) {
	SessionHelper.getLoginSessionBinding(
		rootBinding.sub('userData')
	).set(
		Immutable.fromJS({})
	);
}

const Superuser = {
	runAsSuperUser:		runAsSuperUser,
	loginAsSuperUser:	loginAsSuperUser,
	logout:				logout
};

module.exports = Superuser;
