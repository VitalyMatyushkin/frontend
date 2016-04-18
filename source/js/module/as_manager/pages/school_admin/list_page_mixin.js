const   If          = require('module/ui/if/if'),
        Filter      = require('module/ui/list/filter'),
        GroupAction = require('module/ui/list/group_action'),
        SVG 		= require('module/ui/svg'),
        React       = require('react'),
        Immutable   = require('immutable');

const ListPageMixin = {
	propTypes: {
        serviceName:        React.PropTypes.string,
        serviceCount:       React.PropTypes.string
	},

    componentWillMount: function () {
		const   self            = this,
                globalBinding   = self.getMoreartyContext().getBinding(),
                metaBinding     = self.getDefaultBinding().meta(),
                binding         = self.getDefaultBinding(),
                activeSchoolId  = globalBinding.get('userRules.activeSchoolId');

        self.serviceName = self.props.serviceName ? self.props.serviceName : self.serviceName;
        self.serviceCount = self.props.serviceCount ? self.props.serviceCount : self.serviceCount;
		!self.serviceName && console.error('Please provide service name');
		self.activeSchoolId = activeSchoolId;

        metaBinding.set('isFiltersActive', false);
        self.filter = new Filter(binding.sub('filter'));
        self.filter.setFilters(self.filters);
	},
    getDefaultState: function () {
        return Immutable.Map({
            onReload:false,
            popup:false
        });
    },
    reloadData:function(){
        const self = this,
            binding = self.getDefaultBinding();

        binding.set('onReload',true);
    },
    getDataPromise:function(filter){
        const self = this;

        if(self.activeSchoolId !== null && self.serviceName)
            return window.Server[self.serviceName].get(self.activeSchoolId, { filter: filter });

        return window.Server[self.serviceName].get({filter:filter});
    },
    getTotalCountPromise:function(where){
        const self = this;

        if(self.activeSchoolId !== null && self.serviceCount)
            return window.Server[self.serviceCount].get(self.activeSchoolId, { where: where });

        return window.Server[self.serviceCount].get({where:where});
    },
	_getEditFunction: function() {
		return function(data) {
			document.location.hash = document.location.hash + '/edit?id=' + data.id;
		}
	},
    _addNewClassFunction:function(){
        document.location.hash = document.location.hash +'/add';
    },
    _addNewHouseFunction:function(){
        document.location.hash = document.location.hash +'/add';
    },
    _getAddNewStudentFunction:function(){
        document.location.hash = document.location.hash +'/add';
    },
    _addNewSport:function(){
        document.location.hash = document.location.hash +'/add';
    },
    _addNewTeam:function(){
        document.location.hash = document.location.hash +'/add';
    },
    _getAddNewSchoolFunction:function(){
        document.location.hash = 'admin_schools/admin_views/add';
    },
    _adminCreateNewUser:function(){
        document.location.hash = 'admin_schools/admin_views/create_user';
    },
    _createNewsItem:function(){
        document.location.hash = 'school_admin/news/add';
    },
	toggleFilters: function() {
		var self = this,
			metaBinding = self.getDefaultBinding().meta(),
			isFiltersActive = metaBinding.get('isFiltersActive');

        metaBinding.set('isFiltersActive', !isFiltersActive);
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive'),
            currentPage = window.location.href.split('/'),
            includeGroupAction = ['permissions','#admin_schools'],
            listPageTitle;
        if((currentPage[currentPage.length-1] === 'permissions'||currentPage[currentPage.length-1] ==='#admin_schools')){
            listPageTitle = 'Permissions ( '+globalBinding.get('userData.userInfo.firstName')+' '
                +globalBinding.get('userData.userInfo.lastName')+' - '
                +(self.setPageTitle !== undefined ? self.setPageTitle+' )' : 'System Admin )');
        }else{
            listPageTitle = self.setPageTitle ? self.setPageTitle:self.serviceName;
            listPageTitle = listPageTitle[0].toUpperCase() + listPageTitle.slice(1);
        }
		return (
            <div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
                <div className="eSchoolMaster_wrap">
                    <h1 className="eSchoolMaster_title">{listPageTitle}</h1>
                    <div className="eStrip"></div>
                    <div className="filter_btn" onClick={self.toggleFilters}>
                        <SVG icon="icon_search"/> {isFiltersActive ? '↑' : '↓'}
                    </div>
                    <If condition={currentPage[currentPage.length-1] ==='students'}>
                        <div className="addButton" onClick={self._getAddNewStudentFunction}><SVG icon="icon_add_student" /></div>
                    </If>
                    <If condition={(currentPage[currentPage.length-1] ==='list' && currentPage[currentPage.length-2] === 'admin_views')}>
                        <div className="addButton" onClick={self._getAddNewSchoolFunction}><SVG icon="icon_add_school" /></div>
                    </If>
                    <If condition={currentPage[currentPage.length-1] ==='forms'}>
                        <div className="addButtonShort" onClick={self._addNewClassFunction}><SVG icon="icon_add_form" /></div>
                    </If>
                    <If condition={currentPage[currentPage.length-1] ==='houses'}>
                        <div className="addButton addHouse" onClick={self._addNewHouseFunction}></div>
                    </If>
                    <If condition={self.isSuperAdminPage === true}>
                        <div className="bButton" onClick={self._adminCreateNewUser}>Create User</div>
                    </If>
                    <If condition={currentPage[currentPage.length-1] ==='sports'}>
                        <div className="bButton" onClick={self._addNewSport}>Add New Sport</div>
                    </If>
                    <If condition={currentPage[currentPage.length-1] ==='teams'}>
                        <div className="addButtonShort" onClick={self._addNewTeam}><SVG icon="icon_add_team" /></div>
                    </If>
                    <If condition={currentPage[currentPage.length-1] ==='news'}>
                        <div className="addButtonShort" onClick={self._createNewsItem}><SVG icon="icon_add_news" /></div>
                    </If>
                </div>
                <div className="eSchoolMaster_groupAction">
                    <If condition={(includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1)}>
                        <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName}
                                   binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
                    </If>
                </div>
                {self.getTableView()}
                <If condition={(includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1)}>
                    <div className="eSchoolMaster_groupAction">
                        <div className="groupAction bottom_action">
                            <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName} binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
                        </div>
                    </div>
                </If>
            </div>
		)
	}
};

module.exports = ListPageMixin;