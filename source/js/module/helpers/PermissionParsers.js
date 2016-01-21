/**
 * Created by Anatoly on 16.01.2016.
 */

const PermissionParsers = {
    getFullName:function(principal){
        if(principal !== undefined){
            return principal.firstName+' '+principal.lastName;
        }
    },
    getLastName: function(principal) {
        if(principal !== undefined){
            return [principal.lastName].join(' ') + '\r\n[' + principal.email + ']';
        }
    },
    getFirstName:function(principal){
        if(principal !== undefined){
            return principal.firstName;
        }
    },
    getStatus: function(principal) {
        var self = this,
            status = 'Registered';
        if(principal !== undefined){
            if (principal.verified.email === true && principal.verified.phone === true) {
                status = 'Active';
            } else if (principal.verified.email === false || principal.verified.phone === false) {
                status = 'Registered';
            }
        }
        return status;
    },
    getRoles:function(principal){

    },
    getSchool:function(school){
        if(school !== undefined){
            return school.name;
        }
    },
    getObjectVisibility:function(principal){
        if(principal !== undefined){
            if(principal.blocked === true){return 'Blocked';}else{return 'Active';}
        }
    }
};

module.exports = PermissionParsers;