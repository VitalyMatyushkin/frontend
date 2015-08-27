/**
 * Created by bridark on 24/06/15.
 */
var ConsoleList,
    GrantRole = require('../admin_comps/grant_role'),
    Popup = require('module/ui/popup'),
    If = require('module/ui/if/if'),
    currentAction,
    RevokeAccess = require('../admin_comps/revoke_role'),
    EditUser = require('../admin_comps/edit_user'),
    selectedUserProp,
    SVG = require('module/ui/svg');
ConsoleList = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return{alertPopup:false,confirmPopup:false}
    },
    componentWillMount:function(){
        var self = this,
            binding  = self.getDefaultBinding();
        binding.set('popup', false);
        selectedUserProp = " ";
    },
    _allowPopup:function(){

    },
    _renderListData:function(data){
        var self = this,
            binding = self.getDefaultBinding();
        var splitName = function(key, locData){
            var n = locData.role[key][0].name.split(" ");
            return n = n[0]+' ' + n[1];
        };
        return data.map(function(data){
            var roles = [],
                atSchool = [],
                childAtSch = [],
                deleteEntry = function (entryId, entryName, state) {
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
                addNewRole = function(userId,firstName,lastName){
                    return function(evt){
                        binding.set('currentAction','grant');
                        binding.set('selectedUser', {userId:userId,userName:firstName+" "+lastName});
                        binding.set('popup',true);
                        evt.stopPropagation();
                    }
                },
                revokeRole = function(userId, firstName,lastName){
                    return function(evt){
                        binding.set('currentAction','revoke');
                        binding.set('selectedUser', {userId:userId,userName:firstName+" "+lastName});
                        binding.set('popup',true);
                        evt.stopPropagation();
                    }
                },
                editUser = function(userId, userRole){
                    return function(evt){
                        binding.set('currentAction','edit');
                        binding.set('selectedUser',{userId:userId, role:userRole});
                        selectedUserProp = userId;
                        binding.set('popup', true);
                        evt.stopPropagation();
                    }
                };
            if(typeof data !== 'undefined'){
                if(typeof data.role !== 'undefined' && data.role.length >=1){
                    atSchool = data.role.map(function(p){
                        return(
                            <div style={{padding:2+'px'}}>{p.school !== undefined ? p.school.name: ''}</div>
                        );
                    });
                    roles = data.role.map(function(per){
                        return(
                            <div style={{padding:2+'px'}}>{per.preset}</div>
                        )
                    });
                }
                return (
                    <div className="eDataList_listItem" onClick={function(){gotoUser(data.id)}} key={data.id}>
                        <div className="eDataList_listItemCell">{data.firstName+" "+data.lastName}</div>
                        <div className="eDataList_listItemCell">{data.email}</div>
                        <div className="eDataList_listItemCell">{data.verified.email === false && data.verified.phone === false ?'Registered':'Active'}</div>
                        <div className="eDataList_listItemCell">{atSchool}</div>
                        <div className="eDataList_listItemCell">{roles}</div>
                        <div className="eDataList_listItemCell mActions">
                            <span title="Add" onClick={addNewRole(data.id, data.firstName, data.lastName)}><SVG classes="bIcon-mod" icon="icon_plus"/></span>
                            <span title="View"><SVG classes="bIcon-mod" icon="icon_eye"/></span>
                            <span title="Edit" onClick={editUser(data.id,data.role)}><SVG classes="bIcon-mod" icon="icon_pencil"/></span>
                            <If condition={roles.length >= 1}>
                                <span title="Delete" onClick={revokeRole(data.id, data.firstName, data.lastName)}>
                                    <SVG classes="bIcon-mod" icon="icon_trash" />
                                </span>
                            </If>
                            <span title="Block" onClick={deleteEntry(data.id, data.lastName, data.blocked)}><SVG classes="bIcon-mod" icon={data.blocked === true? "icon_user-minus":"icon_user-check"}/></span>
                        </div>
                    </div>
                )
            }
        });
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            permList;
        if(binding.toJS('allUsers') !== undefined){permList = self._renderListData(binding.toJS('allUsers'));}else{permList = <span>{'Loading....'}</span>}
        return (
            <div className="eDataList_console">
                <If condition={binding.get('currentAction') === 'grant'}>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupGrant">
                        <GrantRole binding={binding} />
                    </Popup>
                </If>
                <If condition={binding.get('currentAction') === 'revoke'}>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupRevoke">
                        <RevokeAccess binding={binding} />
                    </Popup>
                </If>
                <If condition={binding.get('currentAction') === 'edit'}>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupEdit">
                        <EditUser binding={binding} />
                    </Popup>
                </If>
                {permList}
            </div>);
    }
});
module.exports = ConsoleList;