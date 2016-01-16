/**
 * Created by bridark on 09/06/15.
 */
    //TODO: Refactoring
const   Map         = require('module/ui/map/map'),
        If          = require('module/ui/if/if'),
        Popup       = require('module/ui/popup'),
        React       = require('react'),
        Immutable   = require('immutable');


let popupChildren,
    managerList,
    schoolOfficial,
    adminsList,
    teachersList,
    coachesList;

const SchoolDetail = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('routing.parameters.id');
        binding.set('modalState',false);

        self.activeSchoolId = activeSchoolId;
        self.request = window.Server.schoolsFindOne.get({
            filter: {
                where: {
                    id: activeSchoolId
                },
                include: 'postcode'
            }
        }).then(function(data) {
            binding.set(Immutable.fromJS(data));
            window.Server.users.get({
                filter:{
                    where:{
                        id:binding.get('ownerId')
                    }
                }
            }).then(
                function(owner){
                    binding.set('schoolOwner',Immutable.fromJS(owner));
                    window.Server.schoolAdmins.get({id:activeSchoolId}).then(function(admins){
                        binding.set('schoolAdmins',Immutable.fromJS(admins));
                        window.Server.schoolCoaches.get({id:activeSchoolId}).then(function(coaches){
                            binding.set('schoolCoaches',Immutable.fromJS(coaches));
                            window.Server.schoolManager.get({id:activeSchoolId}).then(function(managers){
                                binding.set('schoolManagers',Immutable.fromJS(managers));
                                window.Server.schoolTeacher.get({id:activeSchoolId}).then(function(teachers){
                                    binding.set('schoolTeachers',Immutable.fromJS(teachers));
                                    schoolOfficial = self._updateManagerListData(binding.get('schoolOwner').toJS());
                                    managerList = self._updateManagerListData(binding.get('schoolManagers').toJS());
                                    adminsList = self._updateManagerListData(binding.get('schoolAdmins').toJS());
                                    coachesList = self._updateManagerListData(binding.get('schoolCoaches').toJS());
                                    teachersList = self._updateManagerListData(binding.get('schoolTeachers').toJS());
                                });
                            });
                        });
                    });
                }
            );
        });
    },
    componentWillUnmount: function() {
        var self = this;

        self.request && self.request.cancel();
    },
    onUserClick:function(value){
        document.location.hash = '/admin_schools/admin_views/user?id='+value;
    },
    _updateManagerListData:function(listData){
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
                    event.stopPropagation();
                }
            },
            addRole = function(str,value){
                return function(event){
                    self._initiateModal(str, value);
                    event.stopPropagation();
                }
            },
            removeRole = function(str,value){
                return function(event){
                    self._initiateModal(str, value);
                    event.stopPropagation();
                }
            },
            editRole = function(str,value){
                return function(event){
                    self._initiateModal(str, value);
                    event.stopPropagation();
                }
            };
        var tmpList;
        if(listData.length > 0){
            tmpList = listData.map(function(manager){
                return(
                    <div className="eDataList_listItem" onClick={self.onUserClick.bind(null,manager.id)}>
                        <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={manager.avatar}/></span></div>
                        <div className="eDataList_listItemCell">{manager.username}</div>
                        <div className="eDataList_listItemCell">{manager.firstName}</div>
                        <div className="eDataList_listItemCell">{manager.lastName}</div>
                        <div className="eDataList_listItemCell">{manager.gender}</div>
                        <div className="eDataList_listItemCell">{typeof manager.status === 'undefined'? 'N/A': manager.status }</div>
                        <div className="eDataList_listItemCell mActions" style={{textAlign:'left', paddingLeft:0+'px'}}>
                            <span  onClick={addRole('Grant',manager.id)} className="bLinkLike">Grant</span>
                            <span  onClick={removeRole('Revoke',manager.id)} className="bLinkLike">Revoke</span>
                            <span  onClick={editRole('Edit',manager.id)} className="bLinkLike">Edit</span>
                        </div>
                    </div>
                )
            });
        }else{
            tmpList = <div className="eDataList_listItem">
                <div className="eDataList_listItemCell">No Data!</div>
            </div>;
        }
        return tmpList;
    },
    _requestedClose:function(){
    var self = this,
        binding = self.getDefaultBinding();
        binding.set('modalState',false);
    },
    //TODO:refactor repetition of server requests for update of list
    _initiateModal:function(action,value) {
        //alert('This will add a new user');
        var self = this,
            binding = self.getDefaultBinding();
        if(action === 'Grant'){
            var doAction = function(val){
                var sel = document.getElementById(val),
                    baseUrlExt = sel.options[sel.selectedIndex].value;
                window.Server[baseUrlExt].put({id:self.activeSchoolId,fk:value},{userId:value,schoolId:self.activeSchoolId}).then(function(data){
                        alert('Role Granted');
                        self._requestedClose();
                        switch (baseUrlExt){
                            case "manager":
                                window.Server.schoolManager.get({id:self.activeSchoolId}).then(function (managers) {
                                    binding.set('schoolManagers',Immutable.fromJS(managers));
                                    managerList = self._updateManagerListData(binding.get('schoolManagers').toJS());
                                });
                                break;
                            case "addCoach":
                                window.Server.schoolCoaches.get({id:self.activeSchoolId}).then(function(coaches){
                                    binding.set('schoolCoaches',Immutable.fromJS(coaches));
                                    coachesList = self._updateManagerListData(binding.get('schoolCoaches').toJS());
                                });
                                break;
                            case "addTeacher":
                                window.Server.schoolTeacher.get({id:self.activeSchoolId}).then(function(teachers){
                                    binding.set('schoolTeachers',Immutable.fromJS(teachers));
                                    teachersList = self._updateManagerListData(binding.get('schoolTeachers').toJS());
                                });
                                break;
                            case "administrator":
                                window.Server.schoolAdmins.get({id:self.activeSchoolId})
                                    .then(function(admins){
                                        binding.set('schoolAdmins',Immutable.fromJS(admins));
                                        adminsList = self._updateManagerListData(binding.get('schoolAdmins').toJS());
                                    });
                                break;
                            default :
                                break;
                        }
                    }
                );
            };
            popupChildren = (<div>
                <h5>Grant Permissions</h5>
                <select id="grant">
                    <option value="manager">Manager</option>
                    <option value="addCoach">Coach</option>
                    <option value="addTeacher">PE Teacher</option>
                    <option value="administrator">Admin</option>
                </select>
                <div className="eSchoolMaster_buttons" style={{right:19+'px',top:70+'%'}}>
                    <span className ="bButton" onClick={doAction.bind(null,'grant')}>Submit</span>
                </div>
            </div>);
        }else if(action === 'Revoke'){
            var doAction = function(val){
                var sel = document.getElementById(val),
                    baseUrlExt = sel.options[sel.selectedIndex].value;
                window.Server[baseUrlExt].delete({id:self.activeSchoolId,fk:value})
                    .then(function(data){
                        alert('Role Revoked');
                        self._requestedClose();
                        switch (baseUrlExt){
                            case "manager":
                                window.Server.schoolManager.get({id:self.activeSchoolId}).then(function (managers) {
                                    binding.set('schoolManagers',Immutable.fromJS(managers));
                                    managerList = self._updateManagerListData(binding.get('schoolManagers').toJS());
                                });
                                break;
                            case "addCoach":
                                window.Server.schoolCoaches.get({id:self.activeSchoolId}).then(function(coaches){
                                    binding.set('schoolCoaches',Immutable.fromJS(coaches));
                                    coachesList = self._updateManagerListData(binding.get('schoolCoaches').toJS());
                                });
                                break;
                            case "addTeacher":
                                window.Server.schoolTeacher.get({id:self.activeSchoolId}).then(function(teachers){
                                    binding.set('schoolTeachers',Immutable.fromJS(teachers));
                                    teachersList = self._updateManagerListData(binding.get('schoolTeachers').toJS());
                                });
                                break;
                            case "administrator":
                                window.Server.schoolAdmins.get({id:self.activeSchoolId})
                                    .then(function(admins){
                                        binding.set('schoolAdmins',Immutable.fromJS(admins));
                                        adminsList = self._updateManagerListData(binding.get('schoolAdmins').toJS());
                                    });
                                break;
                            default :
                                break;
                        }
                    }
                );
            };
            popupChildren = (<div>
                <h5>Revoke Permissions</h5>
                <select id="revoke">
                    <option value="manager">Manager</option>
                    <option value="addCoach">Coach</option>
                    <option value="addTeacher">PE Teacher</option>
                    <option value="administrator">Admin</option>
                </select>
                <div className="eSchoolMaster_buttons" style={{right:19+'px',top:70+'%'}}>
                    <span className ="bButton" onClick={doAction.bind(null,'revoke')}>Submit</span>
                </div>
            </div>);
        }else{
            popupChildren = <div>Edit</div>
        }
        var tmpState = binding.get('modalState') == true ? false : true;
        binding.set('modalState',tmpState);
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            schoolPicture = binding.get('pic'),
            siteLink = binding.get('domain') + '.squadintouch.com',
            geoPoint = binding.toJS('postcode.point');


        return (
            <div>
                <h1 className="eSchoolMaster_title">
                    {schoolPicture ? <div className="eSchoolMaster_flag"><img src={schoolPicture}/></div> : ''}
                    {binding.get('name')}
                    <div className="eSchoolMaster_buttons">
                        <a href={'/#admin_schools/admin_views/edit?id=' + self.activeSchoolId} className="bButton">Edit...</a>
                    </div>
                </h1>
                <p>PostCode: {binding.get('postcodeId')}</p>

                <p>Address: {binding.get('address')}</p>

                <p>Description: {binding.get('description')}</p>

                <p>Site: <a href={'//' + siteLink} target="blank" title="binding.get('name') homepage">http://{siteLink}</a></p>

                <If condition={geoPoint}>
                    <Map binding={binding} point={binding.toJS('postcode.point')}/>
                </If>
                <div style={{marginTop:10+"px"}}>
                    <h1 className="eSchoolMaster_title"><span>{binding.get('name')} Official</span>
                        <div className="eSchoolMaster_buttons">
                        </div>
                    </h1>
                    <Popup binding={binding}  stateProperty={'modalState'} onRequestClose={self._requestedClose.bind(null,self)}>
                        {popupChildren}
                    </Popup>
                    <div className="bDataList">
                        <div className="eDataList_list mTable">
                            <div className="eDataList_listItem mHead">
                                <div className="eDataList_listItemCell" style={{width:11+'%'}}>Avatar</div>
                                <div className="eDataList_listItemCell" style={{width:15+'%'}}>Username</div>
                                <div className="eDataList_listItemCell" style={{width:15+'%'}}>First Name</div>
                                <div className="eDataList_listItemCell" style={{width:17+'%'}}>Last Name</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Gender</div>
                                <div className="eDataList_listItemCell" style={{width:12+'%'}}>Status</div>
                                <div className="eDataList_listItemCell" style={{width:24+'%'}}>Role Actions</div>
                            </div>
                        </div>
                        <h2>School Official - Owner</h2>
                        <div className="eDataList_list mTable">
                            {schoolOfficial}
                        </div>
                        <h2>Managers</h2>
                        <div className="eDataList_list mTable">
                            {managerList}
                        </div>
                        <h2>Coaches</h2>
                        <div className="eDataList_list mTable">
                            {coachesList}
                        </div>
                        <h2>Admins</h2>
                        <div className="eDataList_list mTable">
                            {adminsList}
                        </div>
                        <h2>Teachers</h2>
                        <div className="eDataList_list mTable">
                            {teachersList}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = SchoolDetail;
