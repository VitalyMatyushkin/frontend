/**
 * Created by Anatoly on 06.05.2016.
 */

const 	AuthorizationServices   = require('module/core/services/AuthorizationServices'),
        Actions                 = require('module/core/actions/actions_admin');


/** Collection of actions to reach REST API from server */
const ActionList = {
    initialize: function(binding) {
        ActionList.login = AuthorizationServices.login;
        ActionList.becom = AuthorizationServices.becom;
        ActionList.getUser = Actions.getUser();
        ActionList.getUserPermissions = Actions.getUserPermissions();
    }
};


module.exports = ActionList;

