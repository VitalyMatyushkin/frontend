/**
 * Created by bridark on 24/06/15.
 */
var AdminPermissionView,
    activeUserInfo,
    ConsoleList = require('./admin_consoleList'),
    AdminPermissionData = [],
    filteredData =[];
AdminPermissionView = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {listUpdate:[]};
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();
            activeUserInfo = globalBinding.get('userData.userInfo').toJS();
        //Get all Users
        window.Server.users.get({filter:{include:['permissions','children']}})
            .then(function(users){
                //binding.set('allUsers',Immutable.fromJS(users));
                //console.log(users);
                users.forEach(function(user){
                    user.role = {};
                    window.Server.Permissions.get({filter:{where:{principalId:user.id},include:['school','student']}})
                        .then(function(role){
                            user.role = role;
                            AdminPermissionData.push(user);
                            binding.set('allUsers',Immutable.fromJS(AdminPermissionData));
                            console.log(binding.toJS('allUsers'));
                        });
                });
            }
        );
    },
    componentWillUnmount:function(){
        AdminPermissionData.length = 0;
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
    _filterInputOnChange:function(){
        var self = this,
            binding = self.getDefaultBinding();
        var val = React.findDOMNode(self.refs.filterInput).value;
        if(val.length >=1){
            window.Server.users.get({filter:{where:{lastName:{like:val,options:'i'}}}}).then(function(users){
                    //binding.set('allUsers',Immutable.fromJS(users));
                    users.forEach(function(user){
                        binding.set('allUsers',Immutable.fromJS(
                            AdminPermissionData.filter(function(filtered){
                                return filtered.id === user.id;
                            })
                        ))
                    });
                }
            );
        }else{
            binding.set('allUsers',Immutable.fromJS(AdminPermissionData));
        }
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        return <div>
            <h1 className="eSchoolMaster_title">
                <span>Permissions{' ( '+activeUserInfo.firstName+ ' '+activeUserInfo.lastName+" - "}</span><span>{" System Admin )"}</span>
                <div className="eSchoolMaster_buttons">
                    <div className="bButton" onClick={function(){self._filterButtonClick()}}><span>Filter </span><span id="filterBtn">{'⇣'}</span></div>
                </div>
            </h1>
            <div id="filterDiv" className="eDataList_listItemCell" style={{display:'none'}}>
                <div className="eDataList_filter">
                    <input ref="filterInput" className="eDataList_filterInput" onChange={self._filterInputOnChange.bind(null,this)} placeholder={'filter by last name'} />
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
module.exports = AdminPermissionView;