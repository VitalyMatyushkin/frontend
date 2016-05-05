/**
 * Created by bridark on 30/06/15.
 */
var UserRole,
    SVG = require('module/ui/svg'),
    React = require('react'),
    ReactDOM = require('reactDom'),
    userRoles;
UserRole = React.createClass({
    mixins:[Morearty.Mixin],
    getRoleData:function(){
        var self, binding;
        self = this;
        var revoke = function (roleId) {
            return function(event){
                var cf = confirm("Are you sure you want to revoke this permission?");
                if(cf === true){
                    window.Server.userPermission.delete(roleId)
                        .then(function(res){
                            console.log(res);
                            alert('Role successfully revoked');
                        });
                }
                event.stopPropagation();
            }
        };
        binding = self.getDefaultBinding();
        userRoles = binding.get('selectedUser').role;
        var tempArray;
        if(typeof userRoles !== 'undefined'){
            tempArray = userRoles.map(function(role){
                return(
                    <div className="bPopupEdit_row bRole">
                        <div className="bPopupEdit_role" style={{width:240+'px'}}>{role.school ? role.school.name:''}</div>
                        <div className="bPopupEdit_role" style={{width:180+'px'}}>{role.preset}</div>
                        <div className="bPopupEdit_role">{typeof role.student !== 'undefined'?role.student.firstName+" "+role.student.lastName:''}</div>
                        <span><SVG classes="bIcon-mod" icon="icon_blocked"/></span>
                        <span onClick={revoke(role.id)}><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                    </div>
                )
            });
            return userRoles = tempArray;
        }
    },
    render:function(){
        var self  = this,
            binding = self.getDefaultBinding();
        if(typeof binding.get('selectedUser').role !== 'undefined'){
            if(binding.get('popup') === true) self.getRoleData();
        }
        return <div>
                    <div className="bPopupEdit_row" style={{marginTop:20+'px', borderTop: 2+'px solid black',borderBottom: 2+'px solid black'}}>
                        <div className="bPopupEdit_roleHead" style={{width:240+'px'}}>School</div>
                        <div className="bPopupEdit_roleHead" style={{width:180+'px'}}>Role</div>
                        <div className="bPopupEdit_roleHead">Details</div>
                        <div className="bPopupEdit_roleHead" style={{width:30+'px'}}>Actions</div>
                    </div>
                {userRoles}
            </div>;
    }
});
module.exports = UserRole;