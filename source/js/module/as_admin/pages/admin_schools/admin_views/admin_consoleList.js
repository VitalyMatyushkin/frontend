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
    SVG = require('module/ui/svg');
ConsoleList = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding  = self.getDefaultBinding();
        binding.set('popup', false);
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
                deleteEntry = function (entryId, entryName) {
                    return function(event){
                        var del = confirm("Are you sure you want to block" + " "+entryName+" ?");
                        if(del == true){
                            alert('No API implemented yet');
                            //window.Server.user.delete({id:entryId})
                            //    .then(function (res) {
                            //        console.log(res);
                            //        alert('User Deleted Successfully');
                            //        document.location.hash = 'admin_schools/admin_views/permissions';
                            //    });
                        }
                        event.stopPropagation();
                    }
                },
                gotoUser = function(userId){
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
                revokeRole = function(userId, userName){
                    return function(evt){
                        binding.set('currentAction','revoke');
                        binding.set('popup',true);
                        evt.stopPropagation();
                    }
                },
                editUser = function(userId, userName){
                    return function(evt){
                        binding.set('currentAction','edit');
                        binding.set('popup', true);
                        evt.stopPropagation();
                    }
                };
            if(typeof data !== 'undefined'){
                if(typeof data.role !== 'undefined' && data.role !== null){
                    if(data.role.admin.length >=1){
                        roles.push('Admin');
                        atSchool.push(data.role.admin[0].name);
                    }
                    if(data.role.coach.length >=1){
                        roles.push('Coach');
                        atSchool.push(data.role.coach[0].name);
                    }
                    if(data.role.manager.length >=1){
                        roles.push('Manager');
                        atSchool.push(data.role.manager[0].name);
                    }
                    if(data.role.parent.length >=1){
                        roles.push('Parent');
                        for(var i= 0; i<data.role.parent.length; i++){
                            var childName = data.role.parent[i].firstName+" "+data.role.parent[i].lastName,
                                formName = data.role.parent[i].school.form.name,
                                schoolName = data.role.parent[i].school.details.name;
                            atSchool.push(schoolName);
                            childName += "("+formName+")";
                            childAtSch.push(childName);
                        }
                    }
                    if(data.role.teacher.length >=1){
                        roles.push('Teacher');
                        atSchool.push(data.role.teacher[0].name);
                    }
                    if(roles.length >=1){
                        roles = roles.map(function(r){
                            return(
                                <div style={{paddingTop: 10+'px'}}>{r}</div>
                            )
                        });
                        atSchool = atSchool.map(function(s){
                            return(
                                <div style={{paddingTop: 10+'px'}}>{s}</div>
                            )
                        });
                        if(childAtSch.length >=1){
                            childAtSch = childAtSch.map(function(c){
                                return(
                                    <div style={{paddingTop: 10+'px'}}>{c}</div>
                                )
                            });
                        }
                    }
                }
                return (
                    <div className="eDataList_listItem" onClick={function(){gotoUser(data.id)}} key={data.id}>
                        <div className="eDataList_listItemCell">{data.firstName+" "+data.lastName}</div>
                        <div className="eDataList_listItemCell">{data.email}</div>
                        <div className="eDataList_listItemCell">{"Status"}</div>
                        <div className="eDataList_listItemCell">{atSchool}</div>
                        <div className="eDataList_listItemCell">{roles}</div>
                        <div className="eDataList_listItemCell mActions">
                            <span title="Add" onClick={addNewRole(data.id, data.firstName, data.lastName)}><SVG classes="bIcon-mod" icon="icon_plus"/></span>
                            <span title="View"><SVG classes="bIcon-mod" icon="icon_eye"/></span>
                            <span title="Edit" onClick={editUser(data.id,data.lastName)}><SVG classes="bIcon-mod" icon="icon_pencil"/></span>
                            <span title="Delete" onClick={revokeRole(data.id, data.lastName)}><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                            <span title="Block" onClick={deleteEntry(data.id, data.lastName)}><SVG classes="bIcon-mod" icon="icon_blocked"/></span>
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
            permList; //console.log(binding.toJS('permissionData'));
        if(typeof binding.toJS('allUsers') !== 'undefined'){permList = self._renderListData(binding.toJS('allUsers'));}
        return (
            <div className="eDataList_console">
                <If condition={binding.get('currentAction') === 'grant'}>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupGrant">
                        <GrantRole binding={binding} />
                    </Popup>
                </If>
                <If condition={binding.get('currentAction') === 'revoke'}>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}}>
                        <RevokeAccess binding={binding} />
                    </Popup>
                </If>
                <If condition={binding.get('currentAction') === 'edit'}>
                    <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}}>
                        <EditUser binding={binding} />
                    </Popup>
                </If>
                {permList}
            </div>);
    }
});
module.exports = ConsoleList;