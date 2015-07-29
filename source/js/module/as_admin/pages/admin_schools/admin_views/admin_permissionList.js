/**
 * Created by bridark on 24/06/15.
 */
var AdminPermissionView,
    List = require('module/ui/list/list'),
    ListField = require('module/ui/list/list_field'),
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
    GrantRole = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
    Popup = require('module/ui/popup');
AdminPermissionView = React.createClass({
    mixins:[Morearty.Mixin, DateTimeMixin, ListPageMixin],
    serviceName:'users',
    filters:{include:[{permissions:['school','student'],where:{accepted:true}}]},
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
            if(role.school !== undefined){
                return(
                    <div>{role.school.name}</div>
                );
            }else{
                return null;
            }
        });
    },
    _getItemViewFunction:function(model){
        window.location.hash = '/admin_schools/admin_views/user?id='+model.id;
    },
    _getQuickEditActionsFactory:function(evt){
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            idAutoComplete = [],
            userId = evt.currentTarget.parentNode.dataset.userobj;
        idAutoComplete.push(userId);
        evt.currentTarget.parentNode.classList.remove('groupActionList_show');
        switch (evt.currentTarget.innerText){
            case 'Add Role':
                rootBinding.set('popup',true);
                rootBinding.set('groupIds',idAutoComplete);
                self.forceUpdate();
                break;
            case 'Revoke All Roles':
                self._revokeAllRoles(userId);
                break;
            case 'Unblock':
                self._accessRestriction(userId,0);
                break;
            case 'Block':
                self._accessRestriction(userId,1);
                break;
            default :
                break;
        }
    },
    _revokeAllRoles:function(ids){
        var self = this,
            binding = self.getDefaultBinding();
        if(ids !== undefined){
            window.Server.Permissions.get({filter:{where:{principalId:ids}}})
                .then(function(permission){
                    permission.forEach(function(p){
                        window.Server.Permission.put({id:p.id},{accepted:false}).then(function(){
                            //binding.update(function(result) {
                            //    return result.filter(function(res) {
                            //        return res.get('id') !== ids;
                            //    });
                            //});
                            self.updateData();
                        });
                    });
                });
        }
    },
    _accessRestriction:function(ids,action){
        var self = this,
            binding = self.getDefaultBinding();
        if(ids !== undefined){
            switch(action){
                case 0:
                    window.Server.user.put({id:ids},{blocked:false}).then(function(){
                        //binding.update(function(result) {
                        //    return result.map(function(res) {
                        //        if(res.get('id')===ids){
                        //            res['blocked'] = false;
                        //        }
                        //        console.log(res.toJS());
                        //        return res;
                        //    });
                        //});
                        self.updateData();
                    });
                    break;
                case 1:
                    window.Server.user.put({id:ids},{blocked:true}).then(function(){
                        self.updateData();
                        //binding.update(function(result) {
                        //    return result.map(function(res) {
                        //        if(res.get('id')===ids){
                        //            res['blocked'] = true;
                        //        }
                        //        console.log(res.toJS());
                        //        return res;
                        //    });
                        //});
                    });
                    break;
                default :
                    break;
            }
        }
    },
    _closePopup:function(){
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding();
        rootBinding.set('popup',false);
        self.forceUpdate();
    },
    getObjectVisibility:function(blocked){
        if(blocked === true){return 'Blocked';}else{return 'Active';}
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" onItemView={self._getItemViewFunction} displayActionText = {false} quickEditActionsFactory={self._getQuickEditActionsFactory}
                       quickEditActions={self.groupActionList} binding={binding} addQuickActions={true} onFilterChange={self.updateData}>
                    <TableField dataField="checkBox" width="1%" filterType="none"></TableField>
                    <TableField dataField="firstName" width="10%">Firstname</TableField>
                    <TableField dataField="lastName" width="10%">Surname</TableField>
                    <TableField dataField="email" width="14%">Email</TableField>
                    <TableField dataField="verified" width="10%" parseFunction={self.getStatus}>Status</TableField>
                    <TableField dataField="permissions" width="35%" parseFunction={self.getSchool}>School</TableField>
                    <TableField dataField="permissions" width="15%" parseFunction={self.getRoles}>Role</TableField>
                    <TableField dataField="blocked" filterType="none" parseFunction={self.getObjectVisibility}>Access</TableField>
                </Table>
                <Popup binding={rootBinding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={rootBinding}/>
                </Popup>
            </div>
        )
    }
});
module.exports = AdminPermissionView;