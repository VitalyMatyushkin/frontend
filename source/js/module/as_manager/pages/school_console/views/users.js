/**
 * Created by Anatoly on 25.04.2016.
 */

const   React       = require('react'),
        UserList    = require('module/shared_pages/users/user_list'),
        Morearty	= require('morearty'),
        GrantRole   = require('module/as_manager/pages/school_console/grant_role/grant_role');

const AdminUsersList = React.createClass({
    mixins:[Morearty.Mixin],

    render:function(){
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <UserList binding={binding} grantRole={GrantRole} permissionServiceName="schoolUserPermission" />
        );

    }
});
module.exports = AdminUsersList;