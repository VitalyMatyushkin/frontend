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
        return {filterButtonUp:false};
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        self.activeSchoolName = globalBinding.toJS().activeSchool.summary.name;
        activeUserInfo = globalBinding.get('userData.userInfo').toJS();
        //Get all permissions related to the active school
        window.Server.schoolPermissions.get({id:activeSchoolId,filter:{
            include:['principal', {student: ['form', 'house']}, 'school']
        }}).then(function(schoolPermissions){
            binding.set('permissionData',Immutable.fromJS(schoolPermissions));
        });
    },
    _filterButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            currentButtonState = self.state.filterButtonUp;
        if(currentButtonState === false){
            self.setState({filterButtonUp:true});
        }else{
            self.setState({filterButtonUp:false});
        }
    },
    _filterInputOnChange:function(event){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        var val = React.findDOMNode(self.refs.filterInputRef).value;
        window.Server.schoolPermissions.get({id:activeSchoolId,filter:{
            include:['principal', {student: ['form', 'house']}, 'school'],
            where:{
                preset:{
                    like:val
                }
            }
        }}).then(function(schoolPermissions){
            //console.log(schoolPermissions);
            binding.set('permissionData',Immutable.fromJS(schoolPermissions));
        });
        self.forceUpdate();
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            filterButtonState = self.state.filterButtonUp,
            filterDivClass = filterButtonState === true ? 'eDataList_listItemCell filterInputActive' : 'eDataList_listItemCell filterInputInActive';
        return <div>
            <h1 className="eSchoolMaster_title">
                <span>Permissions{' ( '+activeUserInfo.firstName+ ' '+activeUserInfo.lastName+" - "}</span><span style={{color:'red'}}>{self.activeSchoolName}</span><span>{" - "+" Admin )"}</span>
                <div className="eSchoolMaster_buttons">
                    <div className="bButton" onClick={self._filterButtonClick.bind(null,this)}><span>Filter </span><span>{filterButtonState === false ? '⇣' : '⇡'}</span></div>
                </div>
            </h1>
            <div ref="filterDiv" className={filterDivClass}>
                <div className="eDataList_filter">
                    <input ref="filterInputRef" className="eDataList_filterInput" onChange={self._filterInputOnChange.bind(null,this)} placeholder={'filter by role'} />
                </div>
            </div>
            <div className="bDataList">
                <div className="eDataList_list mTable">
                    <div className="eDataList_listItem mHead">
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Name</div>
                        <div className="eDataList_listItemCell" style={{width:10+'%'}}>Email</div>
                        <div className="eDataList_listItemCell" style={{width:12+'%'}}>Status</div>
                        <div className="eDataList_listItemCell" style={{width:30+'%'}}>School</div>
                        <div className="eDataList_listItemCell" style={{width:8+'%'}}>Roles</div>
                        <div className="eDataList_listItemCell" style={{width:20+'%'}}>Actions</div>
                    </div>
                   <ConsoleList binding={binding} />
                </div>
            </div>
        </div>;
    }
});
module.exports = PermissionView;
