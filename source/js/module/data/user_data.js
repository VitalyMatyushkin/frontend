const	DataPrototype	= require('module/data/data_prototype'),
		UserDataClass	= Object.create(DataPrototype),
		Helpers			= require('module/helpers/storage'),
		propz			= require('propz'),
		$				= require('jquery');

/**
 * Getting initial state of UserData
 */
UserDataClass.getDefaultState = function () {
	const self = this;

	return {
		authorizationInfo:	self.getInitAuthDataValue(),
		rememberMe:			false
	};
};

/**
 * Binding to data update in UserData
 */
UserDataClass.initBind = function () {
	const	self = this,
			bindObject = self.bindObject;

	self._ajaxSetup(bindObject);
	// Keeping authorization data
	bindObject.addListener('authorizationInfo', function () {
		const	authorizationInfo	= bindObject.toJS('authorizationInfo'),
				rememberMe			= bindObject.toJS('rememberMe');

		if(typeof authorizationInfo !== 'undefined') {
			self.setAuthData(authorizationInfo, rememberMe);
		}
		self._ajaxSetup(bindObject);
	});
};

/**
 * Configuring ajax to perform all ajax requests from jquery with Authorization header
 * @param binding
 * @private
 */
UserDataClass._ajaxSetup = function (binding){
	const authorizationInfo = binding.toJS('authorizationInfo');

	if(authorizationInfo){
		const	h		= authorizationInfo.adminId ? "asid" : "usid",
				options	= {headers:{}};

		options.headers[h] = authorizationInfo.id;

		// A function to be called when the request finishes (after success and error callbacks are executed).
		// If status request is unauthorized, then remove session information.
		options.complete = jqXHR => jqXHR.status === 401 && binding.sub('authorizationInfo').clear();
		$.ajaxSetup(options);
	}
};

UserDataClass.getInitAuthDataValue = function () {
	return Helpers.cookie.get('authorizationInfo');
};

UserDataClass.setAuthData = function (authData, rememberMe) {
	if(rememberMe) {
		Helpers.cookie.set(
			'authorizationInfo',
			authData,
			// TODO why 99?
			{expires: 99}
		);
	} else {
		Helpers.cookie.set('authorizationInfo', authData);
	}
};

module.exports = UserDataClass;