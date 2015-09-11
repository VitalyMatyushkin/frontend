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
    serviceName:'Permissions',
    //serviceCount:'getTotalNumberOfUserModels',
    pageLimit: 20,
    filters:{
      include:['principal','school']
        ,where:{
            //principalId:{neq:''}
            and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
        },
        limit:20
    },
    groupActionList:['Add Role','Revoke All Roles','Unblock','Block','View'],
    isPaginated: true,
    isSuperAdminPage: true,
    getFullName:function(principal){
        if(principal !== undefined){
            return principal.firstName+' '+principal.lastName;
        }
    },
    getPrincipal: function(principal) {
        if(principal !== undefined){
            return [principal.firstName, principal.lastName].join(' ') + '\r\n[' + principal.email + ']';
        }
    },
    getStatus: function(principal) {
        var self = this,
            status = 'Registered';
        if(principal !== undefined){
            if (principal.verified.email === true && principal.verified.phone === true) {
                status = 'Active';
            } else if (principal.verified.email === false || principal.verified.phone === false) {
                status = 'Registered';
            }
        }
        return status;
    },
    getRoles:function(principal){

    },
    getSchool:function(school){
        if(school !== undefined){
            return school.name;
        }
    },
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
            binding = self.getDefaultBinding(),
            idAutoComplete = [],
            userId = evt.currentTarget.parentNode.dataset.userobj;
        userId = binding.get().find(function(id){
            return userId === id.get('id');
        });
        idAutoComplete.push(userId.get('principalId'));
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
                console.log(t+' / '+filterTick[i].get('principalId'));
                ticked[i] = filterTick[i].get('principalId');
                console.log(ticked[i]);
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
                <Table title="Permissions" quickEditActionsFactory={self._getQuickEditActionsFactory} quickEditActions={self.groupActionList} binding={binding} addQuickActions={true} onFilterChange={self.updateData}>
                    <TableField dataField="checkBox" width="1%" filterType="none"></TableField>
                    <TableField dataField="principal" width="20%" parseFunction={self.getPrincipal}>Principal</TableField>
                    <TableField dataField="principal" width="5%" filterType="none" parseFunction={self.getStatus}>Status</TableField>
                    <TableField dataField="school" width="40%" filterType="none"  parseFunction={self.getSchool}>School</TableField>
                    <TableField dataField="preset" width="5%">Role</TableField>
                    <TableField dataField="principal" width="1%" filterType="none" parseFunction={self.getObjectVisibility}>Access</TableField>
                </Table>
                <Popup binding={rootBinding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={rootBinding}/>
                </Popup>
            </div>
        )
    }
});
module.exports = AdminPermissionView;