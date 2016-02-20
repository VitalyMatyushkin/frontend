const   If          = require('module/ui/if/if'),
        Filter = require('module/ui/list/filter'),
        GroupAction = require('module/ui/list/group_action'),
        SVG 				= require('module/ui/svg'),
        React       = require('react'),
        ReactDOM    = require('reactDom'),
        Immutable   = require('immutable'),
        $           = require('jquery');

const ListPageMixin = {
	propTypes: {
		formBinding: React.PropTypes.any,
		filters: React.PropTypes.object,
		addSchoolToFilter: React.PropTypes.bool,
        serviceName: React.PropTypes.string,
        serviceCount: React.PropTypes.string
	},

    componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
            metaBinding = self.getDefaultBinding().meta(),
            binding = self.getDefaultBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        self.serviceName = self.props.serviceName ? self.props.serviceName : self.serviceName;
        self.serviceCount = self.props.serviceCount ? self.props.serviceCount : self.serviceCount;
		!self.serviceName && console.error('Please provide service name');
		self.activeSchoolId = activeSchoolId;
        self.popUpState = false;
        self.updatePageNumbers = true;
        metaBinding.set('isFiltersActive', false);
        self.filter = new Filter(binding.sub('filter'));
        self.filter.setFilters(self.filters);
	},
    componentDidMount:function(){
        //if(this.isSuperAdminPage)
        //    ReactDOM.findDOMNode(this.refs.otherCheck).checked = true;
    },
	componentWillUnmount: function () {
        clearTimeout(this.timeoutId);
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
			//	self.props.formBinding.set(Immutable.fromJS(data));

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

		if (isFiltersActive) {
			metaBinding.set('isFiltersActive', false);
			//self.updateData();
		} else {
			metaBinding.set('isFiltersActive', true);
			//self.updateData(self.lastFiltersState);
		}
	},
    toggleBaseFilters:function(el){
        var self = this,
            currentBase = ReactDOM.findDOMNode(self.refs[el]),
            currentBaseVal = currentBase.value,
            isChecked = currentBase.checked;
        $('.bFilterCheck').attr('checked',false);
        if(isChecked){
            currentBase.checked = isChecked;
            switch (currentBaseVal){
                case 'students':
                    self.filters = {
                        include:['principal','school']
                        ,where:{
                            and:[{preset:{nin:['coach','teacher','parent','manager','owner','admin']}},{preset:'student'}]
                        }
                    };
                    break;
                case 'all':
                    self.filters ={
                        include:['principal','school']
                        ,where:{
                            principalId:{neq:''}
                        }
                    };
                    break;
                case 'others':
                    self.filters={
                        include:['principal','school']
                        ,where:{
                            and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                        }
                    };
                    break;
                default :
                    self.filters={
                        include:['principal','school']
                        ,where:{
                            and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                        }
                    };
                    break;
            }
        }else{
            ReactDOM.findDOMNode(self.refs.otherCheck).checked = true;
            self.filters={
                include:['principal','school']
                ,where:{
                    and:[{principalId:{neq:''}},{preset:{neq:'student'}}]
                }
            };
        }
        self.filter.setWhere(self.filters.where);
        //self.updatePageNumbers = true;
        //self.updateData();
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
            listPageTitle = self.serviceName[0].toUpperCase() + self.serviceName.slice(1);
        }
		return (
			<div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
          <div className="eSchoolMaster_wrap">
              <h1 className="eSchoolMaster_title">{listPageTitle}</h1>
              <div className="eStrip">
              </div>


            <div className="filter_btn" onClick={self.toggleFilters}><SVG icon="icon_search"/> {isFiltersActive ? '↑' : '↓'}</div>
                        <If condition={currentPage[currentPage.length-1] ==='students'}>
                            <div className="addButton" onClick={self._getAddNewStudentFunction}><SVG icon="icon_add_student" /></div>
                        </If>
                        <If condition={(currentPage[currentPage.length-1] ==='list' && currentPage[currentPage.length-2] === 'admin_views')}>
                            <div className="bButton" onClick={self._getAddNewSchoolFunction}>Add New School</div>
                        </If>
                        <If condition={currentPage[currentPage.length-1] ==='forms'}>
                            <div className="addButton addNewForm" onClick={self._addNewClassFunction}></div>
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
                        <If condition={currentPage[currentPage.length-1] ==='news'}>
                            <div className="addButtonShort" onClick={self._createNewsItem}><SVG icon="icon_add_news" /></div>
                        </If>
          </div>
          <div className="eSchoolMaster_groupAction">
              <If condition={(includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1)}>
                  <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName}
                               binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
              </If>
              <div className="eSchoolMaster_buttons eSchoolMaster_buttons_admin">
                  {/*<If condition={self.isSuperAdminPage && false}>
                   <div className="filterBase_container">
                   <span>Filter base: </span>
                   <input type="checkbox" className="bFilterCheck" ref="stdCheck" value="students" onChange={self.toggleBaseFilters.bind(null,'stdCheck')}/><span>Students Only</span>
                   <input type="checkbox" className="bFilterCheck" ref="otherCheck" value="others" onChange={self.toggleBaseFilters.bind(null,'otherCheck')}/><span>Others Only</span>
                   <input type="checkbox" className="bFilterCheck" ref="allCheck" value="all" onChange={self.toggleBaseFilters.bind(null,'allCheck')}/><span>All users</span>
                   </div>
                   </If>*/}
                    </div>
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