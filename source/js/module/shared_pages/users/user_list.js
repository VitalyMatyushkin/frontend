/**
 * Created by Anatoly on 24.04.2016.
 */

const   Table = require('module/ui/list/table'),
        TableField = require('module/ui/list/table_field'),
        UserModel = require('module/data/UserModel'),
        DateTimeMixin = require('module/mixins/datetime'),
        ListPageMixin = require('module/mixins/list_page_mixin'),
        React = require('react'),
        Popup = require('module/ui/popup');

const UsersList = React.createClass({
    mixins:[Morearty.Mixin, DateTimeMixin, ListPageMixin],
    propTypes:{
        grantRole:React.PropTypes.func
    },
    serviceName:'users',
    serviceCount:'usersCount',
    filters:{
        include: {
            relation:"permissions",
            scope: { include: {"relation": "school"}}
        }
    },
    groupActionList:['Add Role','Revoke All Roles','Unblock','Block','View'],
    setPageTitle:"Users & Permissions",
    _getItemViewFunction:function(model){
        var self = this;
        if(model.length === 1){
            window.location.hash = '/admin_schools/admin_views/user?id='+model[0];
        }else{
            alert("You can only perform this action on one Item");
        }
    },
    _getQuickEditActionsFactory:function(itemId,itemName){
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            data = binding.sub('data'),
            idAutoComplete = [],
            userId = itemId;
        userId = data.get().find(function(item){
            return userId === item.id;
        });
        idAutoComplete.push(userId.id);
        switch (itemName){
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
        var actionStr = el.innerText,
            selections = chk,
            self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding();
        if(actionStr !== ''){
            var ticked = [],filterTick=[];
            for(var i=0; i<selections.length; i++)
                if(selections.item(i).checked===true)
                    ticked.push(selections.item(i).dataset.id);

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
    getTableView:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            GrantRole = self.props.grantRole;
        return (
            <div className="eTable_view">
                <Table title="Permissions" binding={binding} quickEditActionsFactory={self._getQuickEditActionsFactory}
                       quickEditActions={self.groupActionList} addQuickActions={true}
                       isPaginated={true} filter={self.filter} getDataPromise={self.getDataPromise}
                       getTotalCountPromise={self.getTotalCountPromise} dataModel={UserModel}>
                    <TableField dataField="checkBox" width="1%" filterType="none"/>
                    <TableField dataField="firstName" >Name</TableField>
                    <TableField dataField="lastName" >Surname</TableField>
                    <TableField dataField="email" >Email</TableField>
                    <TableField dataField="verified" filterType="none" >Status</TableField>
                    <TableField dataField="school" filterType="none" >School</TableField>
                    <TableField dataField="roles" filterType="none" >Role</TableField>
                    <TableField dataField="blocked" filterType="none" >Access</TableField>
                </Table>
                <Popup binding={binding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={binding.sub('grantRole')} userIdsBinding={rootBinding.sub('groupIds')}
                               onSuccess={self._closePopup} />
                </Popup>
            </div>
        )
    }
});
module.exports = UsersList;