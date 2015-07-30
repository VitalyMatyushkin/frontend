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
                self._revokeAllRoles(idAutoComplete);
                break;
            case 'Unblock':
                self._accessRestriction(idAutoComplete,0);
                break;
            case 'Block':
                self._accessRestriction(idAutoComplete,1);
                break;
            default :
                break;
        }
    },
    _getGroupActionsFactory:function(el,chk){
        var actionStr = el.innerText,
            selections = chk,
            self = this,
            rootBinding = self.getMoreartyContext().getBinding();
        if(actionStr !== ''){
            var ticked = [];
            for(var i=0; i<selections.length; i++)if(selections.item(i).checked===true)ticked.push(selections.item(i).dataset.id);
            switch (el.innerText){
                case 'Add Role':
                    if(ticked.length >=1){
                        rootBinding.set('popup',true);
                        rootBinding.set('groupIds',ticked);
                        self.forceUpdate();
                    }else{
                        alert("Please Select at least 1 row");
                    }
                    break;
                case 'Revoke All Roles':
                    self._revokeAllRoles(ticked);
                    break;
                case 'Unblock':
                    self._accessRestriction(ticked,0);
                    break;
                case 'Block':
                    self._accessRestriction(ticked,1);
                    break;
                default :
                    break;
            }
        }else{
            alert("Please select an action to apply");
        }
    },
    _revokeAllRoles:function(ids){
        var self = this,
            binding = self.getDefaultBinding();
        if(ids !== undefined && ids.length >=1 ){
            ids.forEach(function(id){
                window.Server.Permissions.get({filter:{where:{principalId:id}}})
                    .then(function(permission){
                        permission.forEach(function(p){
                            window.Server.Permission.delete({id:p.id}).then(function(){
                                self.updateData();
                            });
                        });
                    });
            });
        }
    },
    _accessRestriction:function(ids,action){
        var self = this,
            binding = self.getDefaultBinding();
        if(ids !== undefined && ids.length >=1){
            switch(action){
                case 0:
                    ids.forEach(function(id){
                        window.Server.user.put({id:id},{blocked:false}).then(function(){
                            self.updateData();
                        });
                    });
                    break;
                case 1:
                    ids.forEach(function(id){
                        window.Server.user.put({id:ids},{blocked:true}).then(function(){
                            self.updateData();
                        });
                    });
                    break;
                default :
                    break;
            }
        }else{
            alert('Please select at least 1 row');
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
                    <TableField dataField="lastName" width="10%">Surname</TableField>
                    <TableField dataField="email" width="14%">Email</TableField>
                    <TableField dataField="verified" width="10%" parseFunction={self.getStatus}>Status</TableField>
                    <TableField dataField="permissions" width="40%" parseFunction={self.getSchool}>School</TableField>
                    <TableField dataField="permissions" width="10%" parseFunction={self.getRoles}>Role</TableField>
                    <TableField dataField="blocked" width="1%" filterType="none" parseFunction={self.getObjectVisibility}>Access</TableField>
                </Table>
                <Popup binding={rootBinding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={rootBinding}/>
                </Popup>
            </div>
        )
    }
});
module.exports = AdminPermissionView;