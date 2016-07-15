/**
 * Created by bridark on 24/06/15.
 */
const   React       = require('react'),
        Morearty	= require('morearty'),
        SVG         = require('module/ui/svg');

// TODO: WTF binding is here ????

const ConsoleList = React.createClass({
    mixins:[Morearty.Mixin],
    _renderListData:function(data){
        var self = this,
            binding = self.getDefaultBinding();
        return data.map(function(item){
            var deleteEntry = function (entryId, entryName, state) {
                return function(event){
                        var act = state === false? 'block':'unblock';
                        var del = confirm("Are you sure you want to "+act+ " "+entryName+" ?");
                        if(del == true){
                            window.Server.user.put({id:entryId},{blocked:!state})
                                .then(function(res){
                                    console.log(res);
                                    binding.set('shouldUpdateList',true);
                                });
                        }
                        event.stopPropagation();
                    }
                },
                gotoUser = function(userId){
                    binding.set('selectedUser', {userId:userId});
                    document.location.hash = '/admin_schools/admin_views/user?id='+userId;
                },
                revokeRole = function(userId, firstName,lastName){
                    return function(evt){
                        binding.set('currentAction','revoke');
                        binding.set('selectedUser', {userId:userId,userName:firstName+" "+lastName});
                        binding.set('popup',true);
                        evt.stopPropagation();
                    }
                };
            return(
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell">{item.principal.firstName+" "+item.principal.lastName}</div>
                    <div className="eDataList_listItemCell">{item.principal.email}</div>
                    <div className="eDataList_listItemCell">{item.principal.verified.email === false && item.principal.verified.phone === false ?'Registered':'Active'}</div>
                    <div className="eDataList_listItemCell">{item.school.name}</div>
                    <div className="eDataList_listItemCell">{item.preset}</div>
                    <div className="eDataList_listItemCell mActions">
                        <span title="Add"><SVG classes="bIcon-mod" icon="icon_plus"/></span>
                        <span title="Delete" onClick={revokeRole(data.id, data.firstName, data.lastName)}>
                                    <SVG classes="bIcon-mod" icon="icon_trash" />
                                </span>
                        <span title="Block"><SVG classes="bIcon-mod" icon={item.blocked === true? "icon_user-minus":"icon_user-check"}/></span>
                    </div>
                </div>
            )
        })
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            permList; //console.log(binding.toJS('permissionData'));
        if(typeof binding.toJS('permissionData') !== 'undefined'){permList = self._renderListData(binding.toJS('permissionData'));}
        return (
            <div className="eDataList_console">{permList}</div>);
    }
});
module.exports = ConsoleList;