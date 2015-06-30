/**
 * Created by bridark on 30/06/15.
 */
var UserRole,
    SVG = require('module/ui/svg'),
    userRoles;
UserRole = React.createClass({
    mixins:[Morearty.Mixin],
    getRoleData:function(){
        var self, revoke, binding;
        self = this;
        revoke = function () {
            var cf = confirm("Are you sure you want to revoke this permission?");
            if(cf === true){
                alert('No API implementation yet');
            }
        };
        binding = self.getDefaultBinding();
        userRoles = binding.get('selectedUser').role;
        var tempArray = [];
        if(typeof userRoles !== 'undefined'){
            if(userRoles.admin.length >=1){
                tempArray.push(
                    <div className="bPopupEdit_row bRole">
                        <div className="bPopupEdit_role">{userRoles.admin[0].name}</div>
                        <div className="bPopupEdit_role">{'Admin'}</div>
                        <div className="bPopupEdit_role">{'Admin'}</div>
                        <span onClick={revoke}><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                        <span><SVG classes="bIcon-mod" icon="icon_blocked"/></span>
                    </div>
                );
            }
            if(userRoles.manager.length >=1){
                tempArray.push(
                    <div className="bPopupEdit_row bRole">
                        <div className="bPopupEdit_role">{userRoles.manager[0].name}</div>
                        <div className="bPopupEdit_role">{'Manager'}</div>
                        <div className="bPopupEdit_role">{'Manager'}</div>
                        <span><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                        <span><SVG classes="bIcon-mod" icon="icon_blocked"/></span>
                    </div>
                );
            }
            if(userRoles.teacher.length >=1){
                tempArray.push(
                    <div className="bPopupEdit_row bRole">
                        <div className="bPopupEdit_role">{userRoles.teacher[0].name}</div>
                        <div className="bPopupEdit_role">{'Teacher'}</div>
                        <div className="bPopupEdit_role">{'Teacher'}</div>
                        <span><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                        <span><SVG classes="bIcon-mod" icon="icon_blocked"/></span>
                    </div>
                );
            }
            if(userRoles.coach.length >=1){
                tempArray.push(
                    <div className="bPopupEdit_row bRole">
                        <div className="bPopupEdit_role">{userRoles.coach[0].name}</div>
                        <div className="bPopupEdit_role">{'Coach'}</div>
                        <div className="bPopupEdit_role">{'Coach'}</div>
                        <span><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                        <span><SVG classes="bIcon-mod" icon="icon_blocked"/></span>
                    </div>
                );
            }
            if(userRoles.parent.length >=1){
                for(var i =0; i<userRoles.parent.length; i++){
                    tempArray.push(
                        <div className="bPopupEdit_row bRole">
                            <div className="bPopupEdit_role">{userRoles.parent[i].school.details.name}</div>
                            <div className="bPopupEdit_role">{'Parent'}</div>
                            <div className="bPopupEdit_role">{userRoles.parent[i].firstName+" "+userRoles.parent[i].lastName}</div>
                            <span><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                            <span><SVG classes="bIcon-mod" icon="icon_blocked"/></span>
                        </div>)
                }
            }
        }
        userRoles = tempArray;
    },
    render:function(){
        var self  = this,
            binding = self.getDefaultBinding();
        if(typeof binding.get('selectedUser').role !== 'undefined'){
            if(binding.get('popup') === true) self.getRoleData();
        }
        return <div>
                    <div className="bPopupEdit_row" style={{marginTop:20+'px', borderTop: 2+'px solid black',borderBottom: 2+'px solid black'}}>
                        <div className="bPopupEdit_roleHead">School</div>
                        <div className="bPopupEdit_roleHead">Role</div>
                        <div className="bPopupEdit_roleHead">Details</div>
                        <div className="bPopupEdit_roleHead">Actions</div>
                    </div>
                {userRoles}
            </div>;
    }
});
module.exports = UserRole;