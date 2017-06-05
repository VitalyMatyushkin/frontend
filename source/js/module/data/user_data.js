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
		authorizationInfo:	self.getInitAuthDataValue()
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
		const	authorizationInfo	= bindObject.toJS('authorizationInfo');

		if(typeof authorizationInfo !== 'undefined') {
			self.setAuthData(authorizationInfo);
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
	let authorizationInfo = Helpers.cookie.get('authorizationInfo');

	// If auth info is not undefined and not valid
	if(
		typeof authorizationInfo !== 'undefined' &&
		!UserDataClass.isValidAuthorizationInfo(authorizationInfo)
	) {
		console.error('Not valid authorization info in cookie.');
		console.error(authorizationInfo);

		authorizationInfo = undefined;
		Helpers.cookie.remove('authorizationInfo');
	} else {
		if (typeof authorizationInfo.id !== 'undefined') {
			/**init session storage */
			Helpers.SessionStorage.set('authorizationInfo', authorizationInfo);
			/**and remove data from cookies.*/
			Helpers.cookie.remove('authorizationInfo');
		}
	}

	return Helpers.SessionStorage.get('authorizationInfo');
};

UserDataClass.isValidAuthorizationInfo = function (authorizationInfo) {
	const	id			= propz.get(authorizationInfo, ['id']),
			userId		= propz.get(authorizationInfo, ['userId']),
			expireAt	= propz.get(authorizationInfo, ['expireAt']);

	return (
		typeof id === 'string' &&
		typeof userId === 'string' &&
		typeof expireAt === 'string'
	);
};

UserDataClass.setAuthData = function (authData) {
	Helpers.SessionStorage.set('authorizationInfo', authData);
};

module.exports = UserDataClass;