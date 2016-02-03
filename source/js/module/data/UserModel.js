/**
 * Created by Anatoly on 16.01.2016.
 */

const UserModel = function(userData){
    const self = this,
        um = UserModel;

    self.id = userData.id;
    self.firstName = userData.firstName;
    self.lastName = userData.lastName;
    self.email = userData.email;
    self.verified = um.getStatus(userData);
    self.roles = um.getRoles(userData);
    self.school = um.getSchool(userData);
    self.blocked = um.getAccess(userData);
};
UserModel.getFullName = function(user){
    if(user){
        return user.firstName+' '+user.lastName;
    }
};
UserModel.getStatus = function(user) {
    if(user && user.verified !== undefined){
        if(user.verified.email == true && user.verified.phone == true && user.verified.personal==true){
            return 'Verified';
        }else{
            return 'Registered';
        }
    }
};
UserModel.getRoles = function(user){
    var res = '';

    if(user && user.permissions)
        user.permissions.map(function(item){
            if(res)
                res += ', ';
            res += item.preset;
        });

    return res;
};
UserModel.getSchool = function(user){
    var res = '';

    if(user && user.permissions)
        user.permissions.map(function(item){
            if(item.school){
                if(res)
                    res += ', ';
                res += item.school.name;
            }
        });

    return res;
};
UserModel.getAccess = function(user){
    return user && user.blocked ? 'Blocked' : 'Active';
};

module.exports = UserModel;