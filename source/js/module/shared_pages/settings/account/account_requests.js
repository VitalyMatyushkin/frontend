/**
 * Created by bridark on 08/07/15.
 */
const   Popup       = require('module/ui/popup'),
        GrantRole   = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
        RoleList    = require('./role_list'),
        React       = require('react'),
        SVG         = require('module/ui/svg'),
        Immutable 	= require('immutable');

const AccountRequests = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return{
            isFilter:false
        };
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        binding.atomically()
            .set('openFilter', false)
            .set('popup',false)
            .set('selectedUser',{
                userId:globalBinding.get('userData.authorizationInfo.userId'),
                userName:'You'
            }).commit();
        self.loadUserPermissions();
    },
    loadUserPermissions:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();
        window.Server.userPermissions.get({userId:globalBinding.get('userData.authorizationInfo.userId')})
            .then(function(userPermissions){
                binding.set('userAccountRoles',Immutable.fromJS(userPermissions));
            });
    },
    handleFilterButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.get('openFilter') === false ? binding.set('openFilter', true) : binding.set('openFilter', false);
    },
    handleAddNewButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',true);
    },
    _closePopup:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
    },
    _onSuccess:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('popup',false);
        self.loadUserPermissions();
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            openFilter = binding.get('openFilter') !== undefined ? binding.get('openFilter') : '',
            filterDivClasses = 'eDataList_listItemCell hideElement '+(openFilter ? 'showElement':'');
        return(
            <div>
                <h1 className="eSchoolMaster_title">
                    My Requests
                    <div className="eSchoolMaster_buttons">
                        <span onClick={self.handleAddNewButtonClick.bind(null,this)} className="eSchoolMaster_plus"><SVG icon="icon_plus"/> New </span>
                        <span onClick={self.handleFilterButtonClick.bind(null,this)} className="bButton">{binding.get('openFilter') ? 'Filter ⇡': 'Filter ⇣'}</span>
                    </div>
                </h1>
                <div className={filterDivClasses} ref="filterInputDiv">
                    <div className="eDataList_filter">
                        <input ref="filterInput" className="eDataList_filterInput" placeholder={'filter by role'} />
                    </div>
                </div>
                <div className="bDataList">
                    <div className="eDataList_list mTable">
                        <div className="eDataList_listItem mHead">
                            <div className="eDataList_listItemCell eDataList_accountReqSchool">School</div>
                            <div className="eDataList_listItemCell eDataList_accountReqRoles">Roles</div>
                            <div className="eDataList_listItemCell eDataList_accountReqDetails">Details</div>
                            <div className="eDataList_listItemCell eDataList_accountReqDate">Request Date</div>
                            <div className="eDataList_listItemCell eDataList_accountReqStatus">Request Status</div>
                            <div className="eDataList_listItemCell">Actions</div>
                        </div>
                        <RoleList binding={binding} />
                    </div>
                </div>
                <Popup binding={binding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupGrant">
                    <GrantRole binding={binding} userIdsBinding={rootBinding.sub('userData.authorizationInfo.userId')}
                               onSuccess={self._onSuccess}/>
                </Popup>
            </div>
        )
    }
});
module.exports = AccountRequests;