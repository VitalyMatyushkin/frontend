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
    theList;

userListPage = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.users.get().then(function(data){
            binding.set('schoolUsers',Immutable.fromJS(data));
            self._updateListData(binding.get('schoolUsers').toJS());
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
            addRole = function(value){
                return function(event){
                    alert('Adds a new role to this user');
                    event.stopPropagation();
                }
            },
            removeRole = function(value){
                return function(event){
                    alert("removes a role from this user");
                    event.stopPropagation();
                }
            },
            editRole = function(value){
                return function(event){
                    alert('This will allow us to swap a role instead of removing or adding');
                }
            };
        theList = listData.map(function(user){
            return(
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={user.avatar}/></span></div>
                    <div className="eDataList_listItemCell">{user.username}</div>
                    <div className="eDataList_listItemCell">{user.firstName}</div>
                    <div className="eDataList_listItemCell">{user.lastName}</div>
                    <div className="eDataList_listItemCell">{typeof user.school === 'undefined'? 'N/A' : user.school}</div>
                    <div className="eDataList_listItemCell">{typeof user.role ==='undefined'? 'N/A' : user.role}</div>
                    <div className="eDataList_listItemCell">{typeof user.status === 'undefined'? 'N/A': user.status }</div>
                    <div className="eDataList_listItemCell mActions" style={{textAlign:'left', paddingLeft:0+'px'}}>
                        <span  onClick={addRole(user.id)} className="bLinkLike">Add</span>
                        <span  onClick={removeRole(user.id)} className="bLinkLike">Remove</span>
                        <span  onClick={editRole(user.id)} className="bLinkLike">Edit</span>
                    </div>
                </div>
            )
        });
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
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    <span>List of Users on SquadInTouch</span>
                    <div className="eSchoolMaster_buttons">
                        <div className="eDataList_listItemCell">
                            <div className="eDataList_filter">
                                <input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by last name'} />
                            </div>
                        </div>
                    </div>
                </h1>
                <div className="bDataList">
                    <div className="eDataList_list mTable">
                        <div className="eDataList_listItem mHead">
                            <div className="eDataList_listItemCell" style={{width:5+'%'}}>Avatar</div>
                            <div className="eDataList_listItemCell" style={{width:12+'%'}}>Username</div>
                            <div className="eDataList_listItemCell" style={{width:15+'%'}}>First Name</div>
                            <div className="eDataList_listItemCell" style={{width:15+'%'}}>Last Name</div>
                            <div className="eDataList_listItemCell" style={{width:10+'%'}}>School</div>
                            <div className="eDataList_listItemCell" style={{width:10+'%'}}>Role</div>
                            <div className="eDataList_listItemCell" style={{width:10+'%'}}>Status</div>
                            <div className="eDataList_listItemCell" style={{width:23+'%'}}>Role Actions</div>
                        </div>
                        {theList}
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = userListPage;