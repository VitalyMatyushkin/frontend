/**
 * Created by Anatoly on 16.01.2016.
 */

const React = require('react');
const RoleHelper = require('module/helpers/role_helper');

const STATUS_ROLE = {
	ACTIVE: 'ACTIVE',
	ACTIVE_OUTDATE: 'ACTIVE/Outdated'
};

const UserModel = function(userData, userModelParams){
    const 	self = this,
        	um = UserModel,
    		statusPermission = userModelParams ? userModelParams : [];
    self.id = userData.id;
    self.firstName = userData.firstName;
    self.lastName = userData.lastName;
	self.email = userData.email;
	self.gender = userData.gender;
	self.birthday = userData.birthday;
	self.permissions = userData.permissions;
	self.verified = um.getStatus(userData);
    self.roles = um.getRoles(userData, statusPermission);
    self.details = um.getDetails(userData, statusPermission);
    self.roleArray = um.getRoleArray(userData, statusPermission);
    self.school = um.getSchool(userData, statusPermission);
	self.schoolArray = um.getSchoolArray(userData, statusPermission);
    self.status = userData.status;
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
//Lets return block HTML element containing the list of roles
UserModel.getRoles = function(user, statusPermission){
	return (
		<ul>
			{
				this.getRoleArray(user, statusPermission).map( (role, i) => {
					return <li key={i}>{
						RoleHelper.USER_PERMISSIONS_WITHOUT_SCHOOL.PUBLIC_BLOGGER === role ?
							RoleHelper.USER_PERMISSIONS_WITHOUT_SCHOOL_TO_CLIENT.PUBLIC_BLOGGER : role
					}</li>
				} )
			}
		</ul>
	);
};
UserModel.getDetails = function(user, statusPermission){
	return (
		<ul>
			{
				this.getDetailsArray(user, statusPermission).map( (role, i) => <li key={i}>{role}</li> )
			}
		</ul>
	);
};
UserModel.getRoleArray = function (user, statusPermission) {
	let res = [];
	if(user && user.permissions) {
		res = UserModel.filterPermission(user.permissions, statusPermission).map(item => item.preset);
	}

	return res;
};
UserModel.getDetailsArray = function (user, statusPermission) {
	let res = [];
	if(user && user.permissions) {
		res = UserModel.filterPermission(user.permissions, statusPermission).map(item => {
			let result = '';
			if (item.details.isSolePeTeacher) {
				result = 'Sole PE Teacher';
			} else if (item.details.isTrial) {
				result = 'Trial';
			}
			return result;
		});
	}

	return res;
};
/**
 * Response data has filtred on frontend. We check the date interval, than know  outdated this role or not.
 * @param permissions
 * @param statusPermission
 */
UserModel.filterPermission = function(permissions, statusPermission) {
	return permissions.filter((permission) => {
		const today = new Date(),
			activated = permission.activatedAt ? new Date(permission.activatedAt) : null,
			deactivated = permission.deactivatedAt ? new Date(permission.deactivatedAt) : null,
			statusRole = (permission.status === STATUS_ROLE.ACTIVE && activated && deactivated && (today < activated || today > deactivated))
				? STATUS_ROLE.ACTIVE_OUTDATE : permission.status;
		let result;
		const 	indexActiveStatus = statusPermission.indexOf(STATUS_ROLE.ACTIVE),
				indexActiveOutdateStatus = statusPermission.indexOf(STATUS_ROLE.ACTIVE_OUTDATE);
		switch (true){
			case indexActiveStatus !== -1 && indexActiveOutdateStatus !== -1:
				result = (statusRole === statusPermission[indexActiveStatus] || statusRole === statusPermission[indexActiveOutdateStatus]);
				break;
			case statusPermission.length === 1:
				result = statusRole === statusPermission[0];
				break;
			case permission.status === 'REMOVED':
				result = false;
				break;
			default: result = true;
		}
		return result;
	})
};
//Lets return block HTML element containing the list of schools
UserModel.getSchool = function(user, statusPermission){
	return (
		<ul>
			{ this.getSchoolArray(user, statusPermission).map((school, i) => <li key={i}>{school}</li>) }
		</ul>
	);
};

UserModel.getSchoolArray = function(user, statusPermission){
	let res = [];

	if(user && user.permissions) {
		res = UserModel.filterPermission(user.permissions, statusPermission).map(item => {
			if (typeof item.school !== 'undefined') {
				return item.school.name;
			}
		});
	}

	return res;
};
UserModel.getAccess = function(user){
    return user && user.blocked ? 'Blocked' : 'Active';
};

module.exports = UserModel;
