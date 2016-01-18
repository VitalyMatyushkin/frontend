/**
 * Created by bridark on 24/06/15.
 */
const   Table = require('module/ui/list/table'),
        TableField = require('module/ui/list/table_field'),
        up = require('module/helpers/userParsers'),
        DateTimeMixin = require('module/mixins/datetime'),
        ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
        GrantRole = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
        React = require('react'),
        Popup = require('module/ui/popup');
const AdminPermissionView = React.createClass({
    mixins:[Morearty.Mixin, DateTimeMixin, ListPageMixin],
    //serviceName:'Permissions',
    //serviceCount:'PermissionsCount',
    // for users{"include": {"relation":"permissions", "scope": {"include": {"relation": "school"}}}}
    //filters:{
    //    include:['principal','school']
    //    ,where:{
    //        //principalId:{neq:''}
    //        and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
    //    }
    //},
    serviceName:'users',
    serviceCount:'getTotalNumberOfUserModels',
    filters:{
        include: {
            relation:"permissions",
            scope: { include: {"relation": "school"}}
        }
    },
    groupActionList:['Add Role','Revoke All Roles','Unblock','Block','View'],
    isSuperAdminPage: true,
    _getItemViewFunction:function(model){
        var self = this,
            binding = self.getDefaultBinding(),
            selectedModel;
        if(model.length === 1){
            window.location.hash = '/admin_schools/admin_views/user?id='+model[0];
        }else{
            alert("You can only perform this action on one Item");
        }
    },
    _getQuickEditActionsFactory:function(evt){
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding().sub('data'),
            idAutoComplete = [],
            userId = evt.currentTarget.parentNode.dataset.userobj,
            currentAction;
        userId = binding.get().find(function(id){
            return userId === id.get('id');
        });
        idAutoComplete.push(userId.get('principalId'));
        evt.currentTarget.parentNode.classList.remove('groupActionList_show');
        //caters for different browser implementations of innerText and innerHTML
        //Performs the relevant quick edit actions based on the action name:string
        currentAction = evt.currentTarget.textContent;
        switch (currentAction){
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
            case 'View':
                self._getItemViewFunction(idAutoComplete);
                break;
            default :
                break;
        }
    },
    _getGroupActionsFactory:function(el,chk){
        var actionStr = el.innerText,
            selections = chk,
            self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding();
        if(actionStr !== ''){
            var ticked = [],filterTick=[];
            for(var i=0; i<selections.length; i++)if(selections.item(i).checked===true)ticked.push(selections.item(i).dataset.id);
            ticked.forEach(function(t,i){
                filterTick.push(
                    binding.get().find(function(dt){
                        return t === dt.get('id');
                    })
                );
                ticked[i] = filterTick[i].get('principalId');
            });
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
                                window.Server.Permission.delete({id:p.id}).then(function(){
                                    self.updateData();
                                });
                            });
                        });
                });
            }
        }
    },
    _accessRestriction:function(ids,action){
        var self = this,
            binding = self.getDefaultBinding(),
            confirmAction= window.confirm("Are you sure you want block user?");
        if(ids !== undefined && ids.length >=1){
            if(confirmAction === true){
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
    getObjectVisibility:function(principal){
        if(principal !== undefined){
            if(principal.blocked === true){return 'Blocked';}else{return 'Active';}
        }
    },
    getEmail:function(principal){
        if(principal !== undefined){
            return principal.email;
        }
    },
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding} quickEditActionsFactory={self._getQuickEditActionsFactory}
                       quickEditActions={self.groupActionList} addQuickActions={true}
                       isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} >
                    <TableField dataField="checkBox" width="1%" filterType="none"></TableField>
                    <TableField dataField="firstName" width="10%" >Name</TableField>
                    <TableField dataField="lastName" width="20%" parseFunction={up.getLastName}>Surname</TableField>
                    <TableField dataField="principal" width="5%" filterType="none" parseFunction={up.getStatus}>Status</TableField>
                    <TableField dataField="school" width="40%" dataFieldKey="name"  parseFunction={up.getSchool}>School</TableField>
                    <TableField dataField="preset" width="5%" dataFieldKey="preset">Role</TableField>
                    <TableField dataField="principal" width="1%" filterType="none" parseFunction={up.getObjectVisibility}>Access</TableField>
                </Table>
                <Popup binding={rootBinding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={rootBinding}/>
                </Popup>
            </div>
        )
    }
});
module.exports = AdminPermissionView;