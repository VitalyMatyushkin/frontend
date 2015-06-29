/**
 * Created by bridark on 19/06/15.
 */
var PermissionView,
    activeUserInfo,
    ConsoleList = require('./console_list'),
    permissionData = {};
PermissionView = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {listUpdate:[]};
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        self.activeSchoolName = globalBinding.toJS().activeSchool.summary.name;
        activeUserInfo = globalBinding.get('userData.userInfo').toJS();
        //Get all permissions related to the active school
        window.Server.schoolCoaches.get({id:activeSchoolId})
            .then(function (coaches) {
                permissionData.coaches = coaches;
                window.Server.schoolAdmins.get({id:activeSchoolId})
                    .then(function (admins) {
                        permissionData.admins = admins;
                        window.Server.schoolTeacher.get({id:activeSchoolId})
                            .then(function (teachers) {
                                permissionData.teachers = teachers;
                                window.Server.schoolManager.get({id:activeSchoolId})
                                    .then(function (managers) {
                                        permissionData.managers = managers;
                                        binding.set('permissionData',permissionData);
                                    });
                            });
                    });
            });
    },
    _filterButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            filterDiv,
            filterBtn;
        filterDiv = document.getElementById('filterDiv');
        filterBtn = document.getElementById('filterBtn');
        if(self._filterButtonState === false){
            self._filterButtonState = true;
            filterDiv.style.display = 'table-cell';
            filterBtn.innerHTML = '⇡';
        }else{
            self._filterButtonState = false;
            filterDiv.style.display = 'none';
            filterBtn.innerHTML = '⇣';
        }
    },
    _filterInputOnChange:function(event){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        var val = event.currentTarget.value;
        window.Server.schoolCoaches.get({id:activeSchoolId, filter:{where:{lastName:{like:val, options:'i'}}}})
            .then(function (coaches) {
                permissionData.coaches = coaches;
                window.Server.schoolAdmins.get({id:activeSchoolId, filter:{where:{lastName:{like:val, options:'i'}}}})
                    .then(function (admins) {
                        permissionData.admins = admins;
                        window.Server.schoolTeacher.get({id:activeSchoolId, filter:{where:{lastName:{like:val, options:'i'}}}})
                            .then(function (teachers) {
                                permissionData.teachers = teachers;
                                window.Server.schoolManager.get({id:activeSchoolId, filter:{where:{lastName:{like:val, options:'i'}}}})
                                    .then(function (managers) {
                                        permissionData.managers = managers;
                                        binding.set('permissionData',permissionData);
                                        self.forceUpdate();
                                    });
                            });
                    });
            });
        self.forceUpdate();
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        return <div>
            <h1 className="eSchoolMaster_title">
                <span>Permissions{' ( '+activeUserInfo.firstName+ ' '+activeUserInfo.lastName+" - "}</span><span style={{color:'red'}}>{self.activeSchoolName}</span><span>{" - "+" Admin )"}</span>
                <div className="eSchoolMaster_buttons">
                    <div className="bButton" onClick={self._filterButtonClick.bind(null)}><span>Filter </span><span id="filterBtn">{'⇣'}</span></div>
                </div>
            </h1>
            <div id="filterDiv" className="eDataList_listItemCell" style={{display:'none'}}>
                <div className="eDataList_filter">
                    <input className="eDataList_filterInput" onChange={self._filterInputOnChange.bind(null)} placeholder={'filter by last name'} />
                </div>
            </div>
            <div className="bDataList">
                <div className="eDataList_list mTable">
                    <div className="eDataList_listItem mHead">
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Name</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>email</div>
                        <div className="eDataList_listItemCell" style={{width:15+'%'}}>Phone</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Roles</div>
                        <div className="eDataList_listItemCell" style={{width:30+'%'}}>Additional Settings</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Actions</div>
                    </div>
                   <ConsoleList binding={binding} />
                </div>
            </div>
        </div>;
    }
});
module.exports = PermissionView;
