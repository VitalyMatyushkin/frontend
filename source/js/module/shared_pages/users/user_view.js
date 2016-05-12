/**
 * Created by bridark on 12/06/15.
 */

//      Данный компонент общий, поэтому должен уметь работать как для суперадмина, так и для менеджера.
// Есть две проблемы которые необходимо решить:
//            1. разные сервисы у суперадмина и менеджеров,
//            2. разные наборы параметров для этих сервисов.
//      Первая проблема решается с помощью props и способностью роутера эти props передавать. Посредством пропс
// мы передаем сервис, который нужно использовать. (см. метод - getDefaultProps)
//      Вторая проблема решается формированием избыточного набора параметров, т.е. включающего параметры необходимые в
// обоих случаях. Сервис сам отберет только нужные ему значения. (self.params = {schoolId:schoolId, userId:userId};)

const   EditUser    = require('./user_edit'),
        React       = require('react'),
        Popup       = require('module/ui/popup'),
        Immutable   = require('immutable'),
        If          = require('module/ui/if/if');

const UserDetail= React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultProps: function() {
        return {
            userPermissionsService: window.Server.userPermissions, //service for superadmin by default
            isEditable:true
        };
    },
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            userId = globalBinding.get('routing.parameters.id'),
            schoolId = globalBinding.get('userRules.activeSchoolId');

        //Parameters services for the super-administrator and managers
        self.params = {schoolId:schoolId, userId:userId};

        binding.set('selectedUser',{userId:userId});
        binding.set('popup',false);
        self.request = window.Server.user.get(self.params)
            .then(function(user){
                user.roles = {};
                self.props.userPermissionsService.get(self.params,{
                        filter: {
                            include:['school',{student:'user'}]
                        }
                    }).then(function(data){
                    user.roles = data;
                    binding.set('userWithPermissionDetail',Immutable.fromJS(user));
                    binding.set('selectedUser',{userId:userId, role:data});
                    return data;
                });
                return user;
            });
        self.addBindingListener(binding, 'popup', function(){
            if(binding.get('popup')===false){
                window.Server.user.get(self.params)
                .then(function(user){
                    user.roles = {};
                    self.props.userPermissionsService.get(self.params, {
                        filter: {
                            include:['school',{student:'user'}]
                        }
                    }).then(function(data){
                        user.roles = data;
                        binding.set('userWithPermissionDetail',Immutable.fromJS(user));
                        return data;
                    });
                    return user;
                });
            }
        });
    },
    componentWillUnmount: function() {
        var self = this;
        self.request && self.request.cancel();
    },
    onEditClick:function(evt){
        const   self = this,
                binding = self.getDefaultBinding();

        binding.set('popup',true);
        evt.stopPropagation();
    },
    _getRelatedSchool:function(data){
        var self = this;
        if(data !== undefined){
            return data.map(function(role, i){
                return(
                    <div key={i} className="eDataList_listItem">
                        <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={role.school ? role.school.pic:'http://placehold.it/400x400'}/></span></div>
                        <div className="eDataList_listItemCell">{role.school ? role.school.name: 'n/a'}</div>
                        <div className="eDataList_listItemCell">{role.student ? role.student.firstName+" "+role.student.lastName : ''}</div>
                        <div className="eDataList_listItemCell">{role.preset}</div>
                    </div>
                )
            });
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

                <div className = "bAdminView">

                    <h1 className="eSchoolMaster_title">
                        {profilePicture ? <div className="eSchoolMaster_flag"><img src={profilePicture}/></div> : ''}
                        {username}
                        <If condition={self.props.isEditable}>
                            <div className="eSchoolMaster_buttons">
                                <a onClick={self.onEditClick} className="bButton">Edit...</a>
                            </div>
                        </If>
                    </h1>
                    <div>
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
                    </div>
                </div>

                <div style={{padding:10+'px'}}>
                    <div className="eSchoolMaster_wrap">
                        <h1 className="eSchoolMaster_title">Related Schools</h1>
                        <div className="eStrip"></div>
                    </div>
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
                <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupEdit">
                    <EditUser binding={binding} />
                </Popup>
            </div>
        )
    }
});


module.exports = UserDetail;