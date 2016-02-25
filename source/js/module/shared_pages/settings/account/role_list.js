/**
 * Created by bridark on 08/07/15.
 */
var RoleList,
    DateTimeMixin = require('module/mixins/datetime'),
    React = require('react'),
    Immutable = require('immutable'),
    ConfirmDialog = require('module/ui/confirm_dialog'),
    SVG = require('module/ui/svg');
RoleList = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    getDefaultState:function(){
        return Immutable.fromJS({
            dialogMessage:'', //Confirmation dialog box needs these to work properly
            dialogShow:false
        });
    },
    _checkRequestStatus:function(valueToCheck){
        if(valueToCheck !== undefined && valueToCheck === true){
            return <span className="roleAccepted">{'Accepted'}</span>;
        }else if(valueToCheck !== undefined && valueToCheck === false){
            return <span className="roleDeclined">{'Declined'}</span>;
        }
        else{
            return <span className="rolePending">{'Pending'}</span>;
        }
    },
    _performWithdrawal:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();
        //This will send another permission request to admin with special message/comment requesting a previous request
        //to be removed - Temporary measure for now until we have that on server side
        if(binding.get('confirmed')) {
            let withdrawalModel = {
                preset:self.currentPermission.preset,
                principalId: self.currentPermission.principalId,
                schoolId:self.currentPermission.schoolId,
                comment:`Please withdraw my permission as a ${self.currentPermission.preset}`,
                accepted:false
            };
            window.Server.Permissions.post(withdrawalModel)
                .then(function(result){
                    window.Server.userPermissions.get({userId:globalBinding.get('userData.authorizationInfo.userId')})
                        .then(function(permissions){
                            binding.set('userAccountRoles',Immutable.fromJS(permissions));
                            return permissions;
                        }).catch(function(error){
                        alert(error.errorThrown+' occurred while fetching permissions for user');
                    });
                    return result;
                }).catch(function(error){
                alert(error.errorThrown + ' occurred while requesting withdrawal');
            });
        }
    },
    _withdrawRequest:function(permission){
        var self = this,
            binding = self.getDefaultBinding();
        binding
            .atomically()
            .set('dialogMessage',`Are you sure you want to withdraw your permission ${permission.preset}`) // Message to be shown in dialog
            .set('dialogShow',true)
            .set('callbackFunc',self._performWithdrawal) //callback function to be executed after confirmation
            .commit();
        self.currentPermission = permission; //persist the current permission id for the callback function to use
    },
    //To be called after the confirm box returns
    _performCancellation:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //This will delete the pending permission - At the moment the admin has no way of knowing a user has cancelled /
        // deleted a pending request
        if(binding.get('confirmed')){
            window.Server.Permission.delete({id:self.currentPermissionId})
                .then(function(result){
                    binding.update('userAccountRoles', function(account){
                        return account.filter(function(ac){
                            return ac.get('id') !== self.currentPermissionId;
                        });
                    });
                    return result;
                }).catch(function(error){
                alert(error.errorThrown + ' occurred while deleting request');
            });
        }
    },
    _cancelRequest:function(permission){
        var self = this,
            binding = self.getDefaultBinding();
        binding
            .atomically()
            .set('dialogMessage','Are you sure you want to cancel pending request?') // Message to be shown in dialog
            .set('dialogShow',true)
            .set('callbackFunc',self._performCancellation) //callback function to be executed after confirmation
            .commit();
        self.currentPermissionId = permission.id; //persist the current permission id for the callback function to use
    },
    _setActions:function(roleData){
        var self = this;
        //If the role has been accepted or rejected then we show a button with text: Withdraw
        //else we show a cancel button instead to cancel request before admin consideration/review
        if(roleData.accepted!== undefined){
            return (
                <div className="eDataList_listItemCell mActions">
                    <span title="Withdraw Request" className="requestActions" onClick={self._withdrawRequest.bind(null,roleData)}>Withdraw</span>
                </div>
            );
        }else{
            return (
                <div className="eDataList_listItemCell mActions">
                    <span title="Cancel Request" className="requestActions" onClick={self._cancelRequest.bind(null,roleData)}>Cancel</span>
                </div>
            );
        }
    },
    _renderRoleList:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            roles = binding.get('userAccountRoles') !== undefined ?binding.toJS('userAccountRoles'):'';
        if(roles.length >= 1){
            return roles.map(function(role){
                let roleStatus = self._checkRequestStatus(role.accepted),
                    roleActions = self._setActions(role);
                return(
                    <div key={role.id} className="eDataList_listItem">
                        <div className="eDataList_listItemCell">{role.school!== undefined ? role.school.name: ''}</div>
                        <div className="eDataList_listItemCell">{role.preset}</div>
                        <div className="eDataList_listItemCell">{role.comment !== undefined ? role.comment:''}</div>
                        <div className="eDataList_listItemCell">{self.getDateFromIso(role.meta.created)}</div>
                        <div className="eDataList_listItemCell">{roleStatus}</div>
                        {roleActions}
                        <ConfirmDialog stringContent={binding.get('dialogMessage')} binding={binding} />
                    </div>
                )
            })
        }
    },
    render:function(){
        var self = this;
        return (
            <div className="eDataList_console">{self._renderRoleList()}</div>
        );
    }
});
module.exports = RoleList;