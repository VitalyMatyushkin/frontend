/**
 * Created by Anatoly on 25.04.2016.
 */

const   React       = require('react'),
        UserList    = require('module/shared_pages/users/user_list'),
        GrantRole   = require('module/as_admin/pages/admin_schools/admin_comps/grant_role');

const AdminUsersList = React.createClass({
    mixins:[Morearty.Mixin],

    render:function(){
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <UserList binding={binding} grantRole={GrantRole} />
        );

    }
});
module.exports = AdminUsersList;