const	DataPrototype	= require('module/data/data_prototype'),
		UserDataClass	= Object.create(DataPrototype),
		Helpers			= require('module/helpers/storage'),
		$				= require('jquery');

/**
 * Getting initial state of UserData
 */
UserDataClass.getDefaultState = function () {
	/**If this is the first request after the login page, the data will be in cookies.*/
	const cookieData = Helpers.cookie.get('authorizationInfo'); //getting data

	if(cookieData && cookieData.id){
		/**init session storage */
		Helpers.SessionStorage.set('authorizationInfo', cookieData);
		/**and remove data from cookies.*/
		Helpers.cookie.remove('authorizationInfo');
	}

	// Recovering authorization state info
	return {
		authorizationInfo: Helpers.SessionStorage.get('authorizationInfo')
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
		const authorizationInfo = bindObject.toJS('authorizationInfo');

		authorizationInfo && Helpers.SessionStorage.set('authorizationInfo', authorizationInfo);
		self._ajaxSetup(bindObject);
	});
};

// configuring ajax to perform all ajax requests from jquery with Authorization header
UserDataClass._ajaxSetup = function (binding){
	const authorizationInfo = binding.toJS('authorizationInfo');

	if(authorizationInfo){
		const	h		= authorizationInfo.adminId ? "asid" : "usid",
				options	= {headers:{}};

		options.headers[h] = authorizationInfo.id;

		/**A function to be called when the request finishes (after success and error callbacks are executed). */
		options.complete = function(jqXHR){
			if(jqXHR.status === 401){
				//if status request is unauthorized, then remove session information
				binding.sub('authorizationInfo').clear();
			}
		};
		$.ajaxSetup(options);
	}
};

module.exports = UserDataClass;