/**
 * Created by bridark on 24/06/15.
 */
const   Table = require('module/ui/list/table'),
        TableField = require('module/ui/list/table_field'),
        parser = require('module/helpers/PermissionParsers'),
        UserModel = require('module/data/UserModel'),
        DateTimeMixin = require('module/mixins/datetime'),
        ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
        GrantRole = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
        React = require('react'),
        Popup = require('module/ui/popup');
const AdminPermissionView = React.createClass({
    mixins:[Morearty.Mixin, DateTimeMixin, ListPageMixin],
    //serviceName:'Permissions',
    //serviceCount:'PermissionCount',
    //filters:{
    //    include:['principal','school']
    //    ,where:{
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
        userId = binding.get().find(function(item){
            return userId === item.id;
        });
        idAutoComplete.push(userId.id);
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
                        return t === dt.id;
                    })
                );
                ticked[i] = filterTick[i].id;
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
                                    self.reloadData();
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
                                self.reloadData();
                            });
                        });
                        break;
                    case 1:
                        ids.forEach(function(id){
                            window.Server.user.put({id:ids},{blocked:true}).then(function(){
                                self.reloadData();
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
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding} quickEditActionsFactory={self._getQuickEditActionsFactory}
                       quickEditActions={self.groupActionList} addQuickActions={true}
                       isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} dataModel={UserModel}>
                    <TableField dataField="checkBox" width="1%" filterType="none"></TableField>
                    <TableField dataField="firstName" >Name</TableField>
                    <TableField dataField="lastName" >Surname</TableField>
                    <TableField dataField="email" >Email</TableField>
                    <TableField dataField="verified" filterType="none" >Status</TableField>
                    <TableField dataField="school" filterType="none" >School</TableField>
                    <TableField dataField="roles" filterType="none" >Role</TableField>
                    <TableField dataField="blocked" >Access</TableField>
                </Table>
                <Popup binding={rootBinding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={rootBinding}/>
                </Popup>
            </div>
        )
    }
});
module.exports = AdminPermissionView;