/**
 * Created by Anatoly on 06.05.2016.
 */

const 	AuthorizationServices   = require('module/core/services/AuthorizationServices'),
        Actions                 = require('module/core/actions/actions');


/** Collection of actions to reach REST API from server */
const ActionList = {
    initialize: function(binding) {
        ActionList.login = AuthorizationServices.login;
        ActionList.becom = AuthorizationServices.becom;
        ActionList.getUser = Actions.getUser(binding);
        ActionList.getUserPermissions = Actions.getUserPermissions(binding);
    }
};


module.exports = ActionList;

