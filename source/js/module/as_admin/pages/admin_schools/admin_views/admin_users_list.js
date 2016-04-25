/**
 * Created by Anatoly on 25.04.2016.
 */

const   React       = require('react'),
        UserList    = require('module/shared_pages/users/user_list'),
        GrantRole   = require('module/as_admin/pages/admin_schools/admin_comps/grant_role');

const AdminUsersList = React.createClass({
    mixins:[Morearty.Mixin],

    _adminCreateNewUser:function(){
        document.location.hash = 'admin_schools/admin_views/create_user';
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            addButton = <div className="bButton" onClick={self._adminCreateNewUser}>Create User</div>;

        return (
            <UserList binding={binding} grantRole={GrantRole} addButton={addButton} />
        );

    }
});
module.exports = AdminUsersList;