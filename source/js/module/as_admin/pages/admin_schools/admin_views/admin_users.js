/**
 * Created by bridark on 11/06/15.
 */
var List = require('module/ui/list/list'),
    ListField = require('module/ui/list/list_field'),
    Table = require('module/ui/list/table'),
    TableField = require('module/ui/list/table_field'),
    DateTimeMixin = require('module/mixins/datetime'),
    SVG = require('module/ui/svg'),
    ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
    userListPage,
    dialogState,
    Popup = require('module/ui/popup'),
    RegisterUser = require('module/ui/register/user'),
    theList;

userListPage = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.users.get().then(function(data){
            binding.set('schoolUsers',Immutable.fromJS(data));
            self._updateListData(binding.get('schoolUsers').toJS());
            binding.set('modalState',false);
        });
    },
    _updateListData:function(listData){
        var self = this,
            binding = self.getDefaultBinding(),
            deleteManager = function(value){
                return function (event){
                    //window.Server.school.delete({id:value}).then(function(result){
                    //        window.Server.schools.get().then(function(data){
                    //            binding.set('schoolList',Immutable.fromJS(data));
                    //            self._updateListData(binding.get('schoolList').toJS());
                    //        });
                    //    }
                    //);
                    console.log('delete');
                    event.stopPropagation();
                }
            },
            blockUser = function(value){
                return function(event){
                    var blockConfirm = confirm("Do you want to block user ?");
                    if(blockConfirm){
                        window.Server.user.put({id:value},{blocked:true})
                            .then(function(res){
                                alert('User has been blocked');
                            });
                    }
                    event.stopPropagation();
                }
            },
            removeRole = function(value){
                return function(event){
                    var wantToDelete = confirm("Do you want to delete this user?");
                    if(wantToDelete == true){
                        window.Server.user.delete({id:value}).then(function(result){
                                console.log(result);
                            }
                        );
                    }
                    event.stopPropagation();
                }
            },
            resetPassword = function(value){
                return function(event){
                    var wantToResetPwd = confirm("Do you want to reset password ?");
                    if(wantToResetPwd == true){
                        window.Server.userPasswordReset.post({email:value}).then(function(res){
                            console.log(res);
                                //Do whatever for password reset
                            }
                        );
                    }
                    event.stopPropagation();
                }
            };
        theList = listData.map(function(user){
            return(
                <div className="eDataList_listItem" onClick={self.onUserClick.bind(null,user.id)}>
                    <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={user.avatar}/></span></div>
                    <div className="eDataList_listItemCell">{user.username}</div>
                    <div className="eDataList_listItemCell">{user.firstName}</div>
                    <div className="eDataList_listItemCell">{user.lastName}</div>
                    <div className="eDataList_listItemCell">{typeof user.registerType ==='undefined'? 'N/A' : user.registerType}</div>
                    <div className="eDataList_listItemCell">{typeof user.status === 'undefined'? 'N/A': user.status }</div>
                    <div className="eDataList_listItemCell mActions" style={{textAlign:'left', paddingLeft:0+'px'}}>
                        <span  onClick={removeRole(user.id)} className="bLinkLike">Remove</span>
                        <span onClick={resetPassword(user.email)} className="bLinkLike">Reset Password</span>
                        <span onClick={blockUser(user.id)} className="bLinkLike">Block</span>
                    </div>
                </div>
            )
        });
    },
    onUserClick:function(value){
        console.log('click'+value);
        document.location.hash = '/admin_schools/admin_views/user?id='+value
    },
    onChange:function(event){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.users.get({
            filter: {
                where: {
                    lastName: {
                        like: event.currentTarget.value,
                        options: 'i'
                    }
                }
            }
        }).then(function(filtered){
            binding.set('schoolUsers',Immutable.fromJS(filtered));
            self._updateListData(binding.get('schoolUsers').toJS());
        });
    },
    _addNewButtonClick:function() {
        //alert('This will add a new user');
        var self = this,
            binding = self.getDefaultBinding();
       var tmpState = binding.get('modalState') == true ? false : true;
        binding.set('modalState',tmpState);
        console.log(binding.get('modalState'));
    },
    _requestedClose:function(){
        var self = this,
            binding = self.getDefaultBinding();
            binding.set('modalState',false);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        var modState = binding.get('modalState');
        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    <span>List of Users on SquadInTouch</span>
                    <div className="eSchoolMaster_buttons">
                        <div onClick={self._addNewButtonClick.bind(null,self)} className="bButton">Add New</div>
                    </div>
                    <div className="eDataList_listItemCell">
                        <div className="eDataList_filter">
                            <input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by last name'} />
                        </div>
                        <Popup binding={binding} otherClass="bPopupAdmin" stateProperty={'modalState'} onRequestClose={self._requestedClose.bind(null,self)}>
                            <RegisterUser binding={binding}></RegisterUser>
                        </Popup>
                    </div>
                </h1>
                <div className="bDataList">
                    <div className="eDataList_list mTable">
                        <div className="eDataList_listItem mHead">
                            <div className="eDataList_listItemCell" style={{width:5+'%'}}>Avatar</div>
                            <div className="eDataList_listItemCell" style={{width:12+'%'}}>Username</div>
                            <div className="eDataList_listItemCell" style={{width:15+'%'}}>First Name</div>
                            <div className="eDataList_listItemCell" style={{width:15+'%'}}>Last Name</div>
                            <div className="eDataList_listItemCell" style={{width:10+'%'}}>Role</div>
                            <div className="eDataList_listItemCell" style={{width:15+'%'}}>Status</div>
                            <div className="eDataList_listItemCell" style={{width:28+'%'}}>Actions</div>
                        </div>
                        {theList}
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = userListPage;