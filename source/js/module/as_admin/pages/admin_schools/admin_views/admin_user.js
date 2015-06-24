/**
 * Created by bridark on 12/06/15.
 */
var UserDetail,
    SVG = require('module/ui/svg'),
    Map = require('module/ui/map/map'),
    If = require('module/ui/if/if'),
    Popup = require('module/ui/popup'),
    popupChildren,
    managerList,
    childrenList=[],
    relatedSchools = [],
    parentChildrenList;
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
            binding.set('selectedUser',Immutable.fromJS(data));
            window.Server.userCoach.get({id:selectedUserId})
                .then(function(asCoach){
                    binding.set('asCoach',Immutable.fromJS(asCoach));
                    relatedSchools.push(self._getRelatedSchool(binding.get('asCoach').toJS(),"Coach"));
                   window.Server.userManager.get({id:selectedUserId})
                       .then(function(asManager){
                           binding.set('asManager',Immutable.fromJS(asManager));
                           relatedSchools.push(self._getRelatedSchool(binding.get('asManager').toJS(),"Manager"));
                           window.Server.userTeacher.get({id:selectedUserId})
                               .then(function(asTeacher){
                                   binding.set('asTeacher',Immutable.fromJS(asTeacher));
                                   relatedSchools.push(self._getRelatedSchool(binding.get('asTeacher').toJS(),"Teacher"));
                                   window.Server.userAdmin.get({id:selectedUserId})
                                       .then(function(asAdmin){
                                           binding.set('asAdmin',Immutable.fromJS(asAdmin));
                                           relatedSchools.push(self._getRelatedSchool(binding.get('asAdmin').toJS(),"Admin"));
                                           window.Server.userChildren.get({id:selectedUserId})
                                               .then(function(children){
                                                   children.forEach(function(child){
                                                       child.school = {details:{},form:{}}
                                                       window.Server.school.get({id:child.schoolId})
                                                           .then(function(childSchool){
                                                               child.school.details = childSchool;
                                                               window.Server.form.get({formId:child.formId})
                                                                   .then(function(childForm){
                                                                       child.school.form = childForm;
                                                                       childrenList.push(child);
                                                                       //console.log(childrenList);
                                                                       binding.set('childrenList',Immutable.fromJS(childrenList));
                                                                       childrenList.pop();
                                                                       relatedSchools.push(self._getRelatedSchool(binding.toJS('childrenList'),"Parent"));
                                                                   })
                                                           })
                                                   })
                                               })
                                       });
                               });
                       });
                });
        });
    },
    componentWillUnmount: function() {
        var self = this;
        relatedSchools.length = 0;
        self.request && self.request.abort();
    },
    onSchoolClick:function(value){
        document.location.hash = '/admin_schools/admin_views/detail?id='+value;
    },
    onStudentClick:function(val){
        console.log('click');
    },
    _getRelatedSchool:function(returnedData,theRole){
        var self = this;
        if(theRole === 'Parent'){
            return returnedData.map(function(data){
                return (
                    <div className="eDataList_listItem" onClick={self.onStudentClick.bind(null,data.id)}>
                        <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={data.school.details.pic}/></span></div>
                        <div className="eDataList_listItemCell">{data.school.details.name}</div>
                        <div className="eDataList_listItemCell">{data.firstName+" "+data.lastName}</div>
                        <div className="eDataList_listItemCell">{data.school.form.name}</div>
                        <div className="eDataList_listItemCell">{theRole}</div>
                        <div className="eDataList_listItemCell">{"Additional Settings"}</div>
                    </div>
                )
            });
        }else{
            if(typeof returnedData[0] !== 'undefined'){
                return(
                    <div className="eDataList_listItem" onClick={self.onSchoolClick.bind(null,returnedData[0].id)}>
                        <div className="eDataList_listItemCell"><span className="eChallenge_rivalPic"><img src={returnedData[0].pic}/></span></div>
                        <div className="eDataList_listItemCell">{returnedData[0].name}</div>
                        <div className="eDataList_listItemCell">{"N/A"}</div>
                        <div className="eDataList_listItemCell">{"N/A"}</div>
                        <div className="eDataList_listItemCell">{theRole}</div>
                        <div className="eDataList_listItemCell">{"Additional Settings"}</div>
                        <div className="eDataList_listItemCell mActions">
                        </div>
                    </div>
                )}
        }
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
                                <div className="eDataList_listItemCell" style={{width:15+'%'}}>Child</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Form</div>
                                <div className="eDataList_listItemCell" style={{width:20+'%'}}>Role</div>
                                <div className="eDataList_listItemCell" style={{width:30+'%'}}>Additional Settings</div>
                                <div className="eDataList_listItemCell" style={{width:10+'%'}}>Actions</div>
                            </div>
                            {relatedSchools}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});


module.exports = UserDetail;