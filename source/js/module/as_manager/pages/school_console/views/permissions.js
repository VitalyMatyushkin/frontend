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
    //TODO Why this code is comment? - because the property is not in used at the moment but could be reused
    setPageTitle:'School Admin',
    filters:{
        include:['principal',{student:['form','house']}]
    },
    groupActionList:['Add Role','Revoke All Roles','Unblock','Block'],
    sandbox:true,
    getFullName:function(principal){
        if(principal !==undefined){
            return principal.firstName+" "+principal.lastName;
        }
    },
    getFirstName:function(principal){
        if(principal !== undefined){
            return principal.firstName;
        }
    },
    getLastName:function(principal){
        if(principal !== undefined){
            return principal.lastName;
        }
    },
    getEmail:function(principal){
        if(principal !== undefined){
            return principal.email;
        }
    },
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
    getSchool:function(school){
        if(school !== undefined){
            return school.name;
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
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            idAutoComplete = [],
            userId = evt.currentTarget.parentNode.dataset.userobj;
        idAutoComplete.push(userId);
        evt.currentTarget.parentNode.classList.remove('groupActionList_show');
        switch (evt.currentTarget.textContent){
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
        var actionStr = el.textContent,
            selections = chk,
            self = this,
            rootBinding = self.getMoreartyContext().getBinding();
        if(actionStr !== ''){
            var ticked = [];
            for(var i=0; i<selections.length; i++)if(selections.item(i).checked===true)ticked.push(selections.item(i).dataset.id);
            switch (el.textContent){
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
        //TODO Why this code is comment?
        var self = this,
            binding = self.getDefaultBinding(),
            confirmAction= window.confirm("Are you sure you want block user?");
        if(ids !== undefined && ids.length >=1){
            if(confirmAction === true){
                switch(action){
                    case 0:
                        ids.forEach(function(id){
                            window.Server.user.put({id:id},{blocked:false}).then(function(res){
                                self.updateData();
                                return res;
                            });
                        });
                        break;
                    case 1:
                        ids.forEach(function(id){
                            window.Server.user.put({id:ids},{blocked:true}).then(function(response){
                                self.updateData();
                                return response;
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
                    <TableField dataField="checkBox" width="1%" filterType="none"></TableField>
                    <TableField dataField="principal" width="20%" dataFieldKey="firstName" filterType="none"  parseFunction={self.getFirstName}>First name</TableField>
                    <TableField dataField="principal" width="20%" dataFieldKey="lastName" filterType="none"  parseFunction={self.getLastName}>Surname</TableField>
                    <TableField dataField="principal" width="14%" filterType="none" parseFunction={self.getEmail}>Email</TableField>
                    <TableField dataField="principal" width="10%" filterType="none" parseFunction={self.getStatus}>Status</TableField>
                    <TableField dataField="preset" width="10%" >Role</TableField>
                    <TableField dataField="principal" width="1%" filterType="none" parseFunction={self.getObjectVisibility}>Access</TableField>
                </Table>
                <Popup binding={rootBinding} stateProperty={'popup'} onRequestClose={self._closePopup} otherClass="bPopupGrant">
                    <GrantRole binding={rootBinding}/>
                </Popup>
            </div>
        )
    }
});
module.exports = PermissionView;
