/**
 * Created by Anatoly on 06.05.2016.
 */

// Implementation actions

const ActionsCode = {
    getUser: function(binding){
        return function (userId){
            const schoolId = binding.get('userRules.activeSchoolId');

            return window.Server.user.get({schoolId:schoolId, userId:userId});
        };
    },
    getUserPermissions: function(binding){
        return function (userId){
            const schoolId = binding.get('userRules.activeSchoolId');

            return window.Server.schoolUserPermissions.get({schoolId:schoolId, userId:userId});
        };
    }
};


module.exports = ActionsCode;
