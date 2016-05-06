/**
 * Created by Anatoly on 06.05.2016.
 */

// Implementation actions

const ActionsCode = {
    getUser: function(){
        return function (userId){
            return window.Server.user.get(userId);
        };
    },
    getUserPermissions: function(){
        return function (userId){
            return window.Server.userPermissions.get(userId);
        };
    }
};


module.exports = ActionsCode;
