/**
 * Created by bridark on 19/06/15.
 */
var PermissionView,
    activeUserInfo,
    SVG = require('module/ui/svg'),
    permissionList;
PermissionView = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {listUpdate:{}}
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');;
        self.activeSchoolName = globalBinding.get('schoolInfo').toJS().name;
        activeUserInfo = globalBinding.get('userData.userInfo').toJS();
        //Get all permissions related to the active school
        window.Server.schoolCoaches.get({id:activeSchoolId})
            .then(function (coaches) {
                window.Server.schoolAdmins.get({id:activeSchoolId})
                    .then(function (admins) {
                        window.Server.schoolTeacher.get({id:activeSchoolId})
                            .then(function (teachers) {
                                window.Server.schoolManager.get({id:activeSchoolId})
                                    .then(function (managers) {
                                        binding.atomically()
                                            .set('sync',true)
                                            .set('coaches',Immutable.fromJS(coaches))
                                            .set('admins',Immutable.fromJS(admins))
                                            .set('teachers',Immutable.fromJS(teachers))
                                            .set('managers',Immutable.fromJS(managers))
                                            .commit();
                                        permissionList = self._renderSchoolPermissionsData();
                                    });
                            });
                    });
            });
    },
    componentDidMount:function(){
        var self = this;
        //self.timerId = setTimeout(function(){self.setState({listUpdate:permissionList})},2000);
    },
    _renderSchoolPermissionsData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
        allPermissions = binding.get('coaches').toJS().concat(binding.get('admins').toJS()).concat(binding.get('teachers').toJS()).concat(binding.get('managers').toJS());
        var duplicates = [],
            nonDupes =[];
        allPermissions.forEach(function(ar,arInd){
            var key = ar.id;
            duplicates[key] = ar;
            allPermissions.forEach(function (arIn, arrId) {
                var inSideKey = arIn.id;
                if(inSideKey in duplicates){
                    console.log('found');
                }else{
                    duplicates[inSideKey] = arIn;
                    nonDupes.push(arIn);
                }
            });
        });
        nonDupes.push(allPermissions[0]);
        //Find roles
        var modes = nonDupes.map(function(n){
            n.role = [];
            var coachCount = binding.get('coaches').toJS().filter(function(c){
                    return c.id === n.id;
                }),
                teacherCount = binding.get('teachers').toJS().filter(function (t) {
                    return t.id === n.id;
                }),
                adminCount = binding.get('admins').toJS().filter(function(a){
                    return a.id === n.id;
                }),
                managerCount = binding.get('managers').toJS().filter(function(m){
                    return m.id === n.id;
                });
            if(coachCount.length >=1){n.role.push('Coach')}
            if(teacherCount.length >= 1){n.role.push('Teacher')}
            if(adminCount.length >=1){n.role.push('Admin')}
            if(managerCount.length >=1){n.role.push('Manager')}
            return n;
        });
        console.log(modes);
        var newNodes = nonDupes.map(function(data){
            var roles,
                deleteEntry = function (entryId) {
                    var del = confirm("Do you want to delete "+entryId+" ?");
                    console.log(del);
                };
            if(typeof data.role !== 'undefined' && data.role !== null){
                if(data.role.length >=1){
                    roles = data.role.map(function(r){
                        return(
                            <div style={{paddingTop: 10+'px'}}>{r}</div>
                        )
                    });
                }
            }
            return (
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell">{data.firstName+" "+data.lastName}</div>
                    <div className="eDataList_listItemCell">{data.email}</div>
                    <div className="eDataList_listItemCell">{data.phone}</div>
                    <div className="eDataList_listItemCell">{roles}</div>
                    <div className="eDataList_listItemCell">{"That spoilt kid"}</div>
                    <div className="eDataList_listItemCell mActions">
                        <span onClick={deleteEntry.bind(null,data.id)} className="bLinkLike"><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                    </div>
                </div>
            )
        });
        return newNodes;
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
    updatePermissionList:function(searchValue){
        var self = this,
            binding = self.getDefaultBinding(),
            currentPermissions = [];
        currentPermissions = currentPermissions.concat(binding.toJS('coaches')).concat(binding.toJS('admins')).concat(binding.toJS('teachers')).concat(binding.toJS('managers'));
        currentPermissions = currentPermissions.filter(function(perms){return perms.lastName === searchValue});
        console.log(currentPermissions);
        var dupes = [],
            singles = [];
        currentPermissions.forEach(function(curP, curPindex){
            dupes[curP.id] = curP;
            currentPermissions.forEach(function(curPi, curPindexI){
                var k = curPi.id;
                if(k in dupes){
                    console.log('filter found');
                }else{
                    console.log('not found');
                    dupes[k] = curPi;
                    singles.push(curPi);
                }
            });
        });
        singles.push(currentPermissions[0]);
        console.log(singles);
        //Find roles
        var modes = singles.map(function(n){
            n.role = [];
            var coachCount = binding.get('coaches').toJS().filter(function(c){
                    return c.id === n.id;
                }),
                teacherCount = binding.get('teachers').toJS().filter(function (t) {
                    return t.id === n.id;
                }),
                adminCount = binding.get('admins').toJS().filter(function(a){
                    return a.id === n.id;
                }),
                managerCount = binding.get('managers').toJS().filter(function(m){
                    return m.id === n.id;
                });
            if(coachCount.length >=1){n.role.push('Coach')}
            if(teacherCount.length >= 1){n.role.push('Teacher')}
            if(adminCount.length >=1){n.role.push('Admin')}
            if(managerCount.length >=1){n.role.push('Manager')}
            return n;
        });
        console.log(modes);
        var newNodes = singles.map(function(data){
            var roles,
                deleteEntry = function (entryId) {
                    var del = confirm("Do you want to delete "+entryId+" ?");
                    console.log(del);
                };
            if(typeof data.role !== 'undefined' && data.role !== null){
                if(data.role.length >=1){
                    roles = data.role.map(function(r){
                        return(
                            <div style={{paddingTop: 10+'px'}}>{r}</div>
                        )
                    });
                }
            }
            return (
                <div className="eDataList_listItem">
                    <div className="eDataList_listItemCell">{data.firstName+" "+data.lastName}</div>
                    <div className="eDataList_listItemCell">{data.email}</div>
                    <div className="eDataList_listItemCell">{data.phone}</div>
                    <div className="eDataList_listItemCell">{roles}</div>
                    <div className="eDataList_listItemCell">{"That spoilt kid"}</div>
                    <div className="eDataList_listItemCell mActions">
                        <span onClick={deleteEntry.bind(null,data.id)} className="bLinkLike"><SVG classes="bIcon-mod" icon="icon_trash" /></span>
                    </div>
                </div>
            )
        });
        return newNodes;
    },
    _filterInputOnChange:function(event){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        var val = event.currentTarget.value,
            tmp;
        //tmp = self.updatePermissionList(val);
        //clearTimeout(self.timerId);
        //self.timerId = setTimeout(function(){self.setState({listUpdate:tmp})},1000);
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
                    {permissionList}
                </div>
            </div>
        </div>;
    }
});
module.exports = PermissionView;