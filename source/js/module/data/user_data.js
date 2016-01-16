const   DataPrototype   = require('module/data/data_prototype'),
        UserDataClass   = Object.create(DataPrototype),
        Helpers		    = require('module/helpers/storage'),
        $               = require('jquery');

/**
 * Getting initial state of UserData
 */
UserDataClass.getDefaultState = function () {
    var self = this;

    // Recovering authorization state info
    return {
        authorizationInfo: Helpers.cookie.get('authorizationInfo') || {}
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

        // configuring ajax to perform all ajax requests from jquery with Authorization header
        $.ajaxSetup({
            headers: {
                Authorization: authorizationInfo.id,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
    });
};

module.exports = UserDataClass;