/**
 * Created by Anatoly on 25.04.2016.
 */

const   React       = require('react'),
        UserList    = require('module/shared_pages/users/user_list'),
        GrantRole   = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
        SVG					= require('module/ui/svg');

const AdminUsersList = React.createClass({
    mixins:[Morearty.Mixin],

    _adminCreateNewUser:function(){
        document.location.hash = 'admin_schools/admin_views/create_user';
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            addButton = <div className="bButtonAdd" onClick={self._adminCreateNewUser}><SVG icon="icon_add_men" /></div>;

        return (
            <UserList binding={binding} grantRole={GrantRole} addButton={addButton} permissionServiceName="userPermission" />
        );

    }
});
module.exports = AdminUsersList;