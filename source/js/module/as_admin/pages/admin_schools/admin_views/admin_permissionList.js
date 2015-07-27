/**
 * Created by bridark on 24/06/15.
 */
var AdminPermissionView,
    List = require('module/ui/list/list'),
    ListField = require('module/ui/list/list_field'),
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin');
AdminPermissionView = React.createClass({
    mixins:[Morearty.Mixin, DateTimeMixin, ListPageMixin],
    serviceName:'users',
    filters:{include:[{permissions:['school','student']}]},
    groupActionList:['Add Role','Revoke All Roles','Unblock','Block'],
    getFullName:function(lastName){
        var self = this,
            binding = self.getDefaultBinding(),
            userObj = binding.get().find(function(model){
                return lastName === model.lastName;
            });
        if(userObj !== undefined){
            return userObj.get('firstName')+' '+userObj.get('lastName');
        }
    },
    getStatus: function(verified) {
        var self = this,
            status = 'Registered';

        if (verified.email === true && verified.phone === true) {
            status = 'Active';
        } else if (verified.email === false || verified.phone === false) {
            status = 'Registered';
        }

        return status;
    },
    getRoles:function(permissions){
        return permissions.map(function(role){
            return (
                <div>{role.preset}</div>
            );
        });
    },
    getSchool:function(permissions){
        return permissions.map(function(role){
            return(
                <div>{role.school.name}</div>
            );
        });
    },
    _getRemoveFunction:function(){

    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding} onItemEdit={self._getRemoveFunction} onFilterChange={self.updateData}>
                    <TableField dataField="checkBox" width="1%" filterType="none"></TableField>
                    <TableField dataField="firstName" width="10%">Firstname</TableField>
                    <TableField dataField="lastName" width="10%">Surname</TableField>
                    <TableField dataField="email" width="14%">Email</TableField>
                    <TableField dataField="verified" width="10%" parseFunction={self.getStatus}>Status</TableField>
                    <TableField dataField="permissions" width="35%" parseFunction={self.getSchool}>School</TableField>
                    <TableField dataField="permissions" width="15%" parseFunction={self.getRoles}>Role</TableField>
                </Table>
            </div>
        )
    }
});
module.exports = AdminPermissionView;