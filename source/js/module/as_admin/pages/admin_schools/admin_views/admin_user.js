/**
 * Created by bridark on 12/06/15.
 */
var UserDetail,
    SVG = require('module/ui/svg'),
    Map = require('module/ui/map/map'),
    If = require('module/ui/if/if'),
    EditUser = require('../admin_comps/edit_user'),
    Popup = require('module/ui/popup');
UserDetail= React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            selectedUserId = globalBinding.get('routing.parameters.id');
        self.selectedUserId = selectedUserId;
        binding.set('selectedUser',{userId:selectedUserId});
        binding.set('popup',false);
        self.request = window.Server.user.get({id:selectedUserId})
            .then(function(user){
                user.roles = {};
                window.Server.Permissions.get({
                        filter: {
                            where: {
                                principalId: user.id,
                                accepted: true
                            },
                            include:['school','student']
                        }
                    }).then(function(data){
                    user.roles = data;
                    binding.set('userWithPermissionDetail',Immutable.fromJS(user));
                    binding.set('selectedUser',{userId:selectedUserId, role:data});
                    //console.log(binding.toJS('userWithPermissionDetail'));
                });
            });
    },
    componentWillUnmount: function() {
        var self = this;
        self.request && self.request.abort();
    },
    onSchoolClick:function(value){
        document.location.hash = '/admin_schools/admin_views/detail?id='+value;
    },
    onEditClick:function(){
        var self, binding;
        self = this;
        binding = self.getDefaultBinding();
        return function(evt){
            binding.set('popup',true);
            evt.stopPropagation();
        }
    },
    _getRelatedSchool:function(data){
        var self = this;
        if(data !== undefined){
            return data.map(function(role){
                return(
                    <div className="eDataList_listItem">
                        <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={role.school !== undefined ? role.school.pic:'http://placehold.it/400x400'}/></span></div>
                        <div className="eDataList_listItemCell">{role.school !== undefined ? role.school.name: 'n/a'}</div>
                        <div className="eDataList_listItemCell">{role.student !== undefined? role.student.firstName+" "+role.student.lastName : ''}</div>
                        <div className="eDataList_listItemCell">{role.preset}</div>
                    </div>
                )
            })
        }
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
    },
    render: function() {
        var self, binding, profilePicture, username, name, email, gender, phone, selectedUserData, listItems;
        self = this;
        binding = self.getDefaultBinding();
        if(typeof binding.toJS('userWithPermissionDetail')!== 'undefined'){
            selectedUserData = binding.toJS('userWithPermissionDetail');
            profilePicture = selectedUserData.avatar;
            name = selectedUserData.firstName+" "+selectedUserData.lastName;
            username = selectedUserData.username;
            email = selectedUserData.email;
            phone = selectedUserData.phone;
            gender = selectedUserData.gender;
            listItems = self._getRelatedSchool(binding.toJS('userWithPermissionDetail').roles);
        }
        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    {profilePicture ? <div className="eSchoolMaster_flag"><img src={profilePicture}/></div> : ''}
                    {username}
                    <div className="eSchoolMaster_buttons">
                        <a onClick={self.onEditClick()} className="bButton">Edit...</a>
                    </div>
                </h1>
                <div className = "bChallenge">
                    <div style={{padding:10+'px'}}>
                       Name: {name}
                    </div>
                    <div style={{padding:10+'px'}}>
                       Gender: {gender}
                    </div>
                    <div style={{padding:10+'px'}}>
                       Email: {email}
                    </div>
                    <div style={{padding:10+'px'}}>
                       Phone: {phone}
                    </div>
                    <div style={{padding:10+'px'}}>
                        <h1>Related Schools</h1>
                    </div>
                    <div className="bDataList">
                        <div className="eDataList_list mTable">
                            <div className="eDataList_listItem mHead">
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>School Crest</div>
                                <div className="eDataList_listItemCell" style={{width:26+'%'}}>School</div>
                                <div className="eDataList_listItemCell" style={{width:35+'%'}}>Child</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>Role</div>
                            </div>
                            {listItems}
                        </div>
                    </div>
                </div>
                <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupEdit">
                    <EditUser binding={binding} />
                </Popup>
            </div>
        )
    }
});


module.exports = UserDetail;