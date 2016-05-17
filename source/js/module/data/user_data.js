const   DataPrototype   = require('module/data/data_prototype'),
        UserDataClass   = Object.create(DataPrototype),
        Helpers		    = require('module/helpers/storage'),
        $               = require('jquery');


/**
 * Getting initial state of UserData
 */
UserDataClass.getDefaultState = function () {
    var self = this,
		authorizationInfo = Helpers.cookie.get('authorizationInfo') || {};

	// After reloading the page, you must configure the Ajax again
	ajaxSetup(authorizationInfo);

    // Recovering authorization state info
    return {
        authorizationInfo: authorizationInfo
    };
};

/**
 * Binding to data update in UserData
 */
UserDataClass.initBind = function () {
    var self = this,
        bindObject = self.bindObject;

    // Keeping authorization data
    bindObject.addListener('authorizationInfo', function () {
        var data = bindObject.get('authorizationInfo'),
            authorizationInfo = data ? data.toJS() : {};

        data && Helpers.cookie.set('authorizationInfo', authorizationInfo);
		ajaxSetup(authorizationInfo);
	});
};

// configuring ajax to perform all ajax requests from jquery with Authorization header
function ajaxSetup(authorizationInfo){

	if(authorizationInfo){
		const 	h 		= authorizationInfo.adminId ? "asid" : "usid",
				options = {headers:{}};

		options.headers[h] = authorizationInfo.id;
		$.ajaxSetup(options);
	}
}

module.exports = UserDataClass;