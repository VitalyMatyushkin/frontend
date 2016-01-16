/**
 * Created by bridark on 08/07/15.
 */
var RoleList,
    DateTimeMixin = require('module/mixins/datetime'),
    React = require('react'),
    ReactDOM = require('reactDom'),
    SVG = require('module/ui/svg');
RoleList = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
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
    _renderRoleList:function(roleData){
        var self = this,
            binding = self.getDefaultBinding();
        if(roleData !== undefined){
            return roleData.map(function(role){
                var roleStatus = self._checkRequestStatus(role.accepted);
                return(
                    <div key={role.id} className="eDataList_listItem">
                        <div className="eDataList_listItemCell">{role.school !== undefined ? role.school.name: ''}</div>
                        <div className="eDataList_listItemCell">{role.preset}</div>
                        <div className="eDataList_listItemCell">{role.comment !== undefined ? role.comment:''}</div>
                        <div className="eDataList_listItemCell">{self.getDateFromIso(role.meta.created)}</div>
                        <div className="eDataList_listItemCell">{roleStatus}</div>
                        <div className="eDataList_listItemCell mActions">
                            <span title="View"><SVG classes="bIcon-mod" icon="icon_eye"/></span>
                        </div>
                    </div>
                )
            })
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            roleList;
        if(binding.get('userAccountRoles')!== undefined){
            roleList = self._renderRoleList(binding.toJS('userAccountRoles'));
        }
        return <div className="eDataList_console">{roleList}</div>;
    }
});
module.exports = RoleList;