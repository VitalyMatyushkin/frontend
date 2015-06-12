/**
 * Created by bridark on 12/06/15.
 */
var UserDetail,
    SVG = require('module/ui/svg'),
    Map = require('module/ui/map/map'),
    If = require('module/ui/if/if'),
    Popup = require('module/ui/popup'),
    popupChildren,
    managerList;

UserDetail= React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            selectedUserId = globalBinding.get('routing.parameters.id');
        self.selectedUserId = selectedUserId;
        self.request = window.Server.users.get({
            filter: {
                where: {
                    id: selectedUserId
                }
            }
        }).then(function(data) {
            console.log(data.avatar);
            binding.set('selectedUser',Immutable.fromJS(data));
            console.log(binding.get('selectedUser').toJS());
        });
    },
    componentWillUnmount: function() {
        var self = this;
        self.request && self.request.abort();
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            profilePicture,
            username,
            name,
            email,
            gender,
            phone,
            selectedUserData = binding.get('selectedUser');
        if(selectedUserData){
            profilePicture = selectedUserData.toJS()[0].avatar;
            username = selectedUserData.toJS()[0].username;
            name = selectedUserData.toJS()[0].firstName+" "+selectedUserData.toJS()[0].lastName;
            email = selectedUserData.toJS()[0].email;
            gender = selectedUserData.toJS()[0].gender;
            phone = selectedUserData.toJS()[0].phone;
        }
        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    {profilePicture ? <div className="eSchoolMaster_flag"><img src={profilePicture}/></div> : ''}
                    {username}
                    <div className="eSchoolMaster_buttons">
                        <a href={'/#admin_schools/admin_views/modify?id=' + self.selectedUserId} className="bButton">Edit...</a>
                    </div>
                </h1>
                <div>
                    {name}
                </div>
                <div>{gender}</div>
                <div>{email}</div>
                <div>{phone}</div>
            </div>
        )
    }
});


module.exports = UserDetail;