/**
 * Created by bridark on 19/06/15.
 */
const Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
    GrantRole = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
    React = require('react'),
    Popup = require('module/ui/popup');

const PermissionView = React.createClass({
    mixins:[Morearty.Mixin, DateTimeMixin, ListPageMixin],
    serviceName:'schoolPermissions',
    serviceCount:'schoolPermissionsCount',
    setPageTitle:'School Admin',
    filters:{
        include:['principal',{student:['form','house']}]
    },
    groupActionList:['Add Role','Revoke All Roles','Unblock','Block'],
    getStatus: function(principal) {
        if(principal !== undefined){
            if(principal.verified.email === true && principal.verified.phone === true){
                return "Active";
            }else{
                return "Registered";
            }
        }
    },
    getRoles:function(permissions){
        if(permissions !== undefined){
            return permissions.map(function(role){
                return (
                    <div>{role.preset}</div>
                );
            });
        }
    },
    _getItemViewFunction:function(model){
        //TODO Why this code is comment?
        console.log(model);
        //if(model.length === 1){
        //    window.location.hash = '/admin_schools/admin_views/user?id='+model[0];
        //}else{
        //    alert("You can only perform this action on one Item");
        //}
    },
    _getQuickEditActionsFactory:function(evt){
        const self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            data = binding.toJS('data'),
            idAutoComplete = [],
            id = evt.currentTarget.parentNode.dataset.userobj;
        let permission = data.find(p => id === p.id);
        idAutoComplete.push(permission.principalId);

        evt.currentTarget.parentNode.classList.remove('groupActionList_show');
        switch (evt.currentTarget.textContent){
            case 'Add Role':
                rootBinding.set('groupIds',idAutoComplete);
                binding.set('popup',true);
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
            case 'View':
                self._getItemViewFunction(idAutoComplete);
                break;
            default :
                break;
        }
    },
    _getGroupActionsFactory:function(el,chk){
        var actionStr = el.textContent,
            selections = chk,
            self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            data = binding.toJS('data');

        if(actionStr !== ''){
            var ticked = [];
            for(var i=0; i<selections.length; i++)
                if(selections.item(i).checked===true) {
                    let permission = data.find(p => selections.item(i).dataset.id === p.id)
                    ticked.push(permission.principalId);
                }

            switch (el.textContent){
                case 'Add Role':
                    if(ticked.length >=1){
                        rootBinding.set('groupIds',ticked);
                        binding.set('popup',true);
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
                case 'View':
                    self._getItemViewFunction(ticked);
                    break;
                default :
                    break;
            }
        }else{
            alert("Please select an action to apply");
        }
    },
    _revokeAllRoles:function(ids){
        //TODO Why this code is comment?
        var self, binding, confirmAction;
        self = this;
        binding = self.getDefaultBinding();
        confirmAction = window.confirm("Are you sure you want revoke all roles?");
        if(ids !== undefined && ids.length >=1 ){
            if(confirmAction === true){
                ids.forEach(function(id){
                    window.Server.Permissions.get({filter:{where:{principalId:id}}})
                        .then(function(permission){
                            permission.forEach(function(p){
                                window.Server.Permission.delete({id:p.id}).then(function(res){
                                    self.updateData();
                                    return res;
                                });
                            });
                            return permission;
                        });
                });
            }
        }
    },
    _accessRestriction:function(ids,action){
        var self = this,
            confirmAction= window.confirm("Are you sure you want block user?");
        if(ids !== undefined && ids.length >=1){
            if(confirmAction === true){
                ids.forEach(function(id){
                    window.Server.user.put({id:id},{blocked: action==1 }).then(function(){
                        self.reloadData();
                    });
                });
            }
        }else{
            alert('Please select at least 1 row');
        }
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
        self.reloadData();
    },
    getObjectVisibility:function(principal){
        if(principal !== undefined){
            return principal.blocked === false ? 'Active' : 'Blocked';
        }
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" quickEditActionsFactory={self._getQuickEditActionsFactory}
                       quickEditActions={self.groupActionList} binding={binding} addQuickActions={true}
                       isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} pageLimit={25}>
                    <TableField dataField="checkBox" width="25px" filterType="none"></TableField>
                    <TableField dataField="principalInfo" dataFieldKey="firstName" >First name</TableField>
                    <TableField dataField="principalInfo" dataFieldKey="lastName" >Surname</TableField>
                    <TableField dataField="principalInfo" dataFieldKey="email" >Email</TableField>
                    <TableField dataField="principal" filterType="none" parseFunction={self.getStatus}>Status</TableField>
                    <TableField dataField="preset" >Role</TableField>
                    <TableField dataField="principal" filterType="none" parseFunction={self.getObjectVisibility}>Access</TableField>
                </Table>
                <Popup binding={binding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={binding.sub('grantRole')} userIdsBinding={rootBinding.sub('groupIds')}
                               onSuccess={self._closePopup} />
                </Popup>
            </div>
        )
    }
});
module.exports = PermissionView;
