const   If          = require('module/ui/if/if'),
        Filter = require('module/ui/list/filter'),
        GroupAction = require('module/ui/list/group_action'),
        React       = require('react'),
        ReactDOM    = require('reactDom'),
        Immutable   = require('immutable'),
        $           = require('jquery');

const ListPageMixin = {
	propTypes: {
		formBinding: React.PropTypes.any,
		filters: React.PropTypes.object,
		addSchoolToFilter: React.PropTypes.bool
	},

    componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
            metaBinding = self.getDefaultBinding().meta(),
            binding = self.getDefaultBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');
		!self.serviceName && console.error('Please provide service name');
		self.activeSchoolId = activeSchoolId;
        self.popUpState = false;
        self.updatePageNumbers = true;
        metaBinding.set('isFiltersActive', false);
        self.filter = new Filter(binding.sub('filter'));
        self.filter.setFilters(self.filters);
	},
    componentDidMount:function(){
        var self = this;
        if(self.isSuperAdminPage)
            ReactDOM.findDOMNode(self.refs.otherCheck).checked = true;
    },
	componentWillUnmount: function () {
		var self = this,
            binding = self.getDefaultBinding();
        self.request && self.request.cancel();
        clearTimeout(self.timeoutId);
        binding.clear();
	},
    getInitialState:function(){
        return {
            onReload:false
        };
    },
    reloadData:function(){
        this.stat.onReload = true;
    },
    getDataPromise:function(filter){
        return window.Server.Permissions.get({filter:filter});
    },
    getTotalCountPromise:function(where){
        return window.Server.PermissionCount.get({where:where});
    },
	_getEditFunction: function() {
		var self = this;

		return function(data) {
			//	self.props.formBinding.set(Immutable.fromJS(data));

			document.location.hash = document.location.hash + '/edit?id=' + data.id;
		}
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
				<h1 className="eSchoolMaster_title">{listPageTitle}</h1>
                <div className="eSchoolMaster_groupAction">
                    <If condition={(includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1)}>
                        <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName}
                                     binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
                    </If>
                    <div className="eSchoolMaster_buttons eSchoolMaster_buttons_admin">
                        <If condition={self.isSuperAdminPage||false}>
                            <div className="filterBase_container">
                                <span>Filter base: </span>
                                <input type="checkbox" className="bFilterCheck" ref="stdCheck" value="students" onChange={self.toggleBaseFilters.bind(null,'stdCheck')}/><span>Students Only</span>
                                <input type="checkbox" className="bFilterCheck" ref="otherCheck" value="others" onChange={self.toggleBaseFilters.bind(null,'otherCheck')}/><span>Others Only</span>
                                <input type="checkbox" className="bFilterCheck" ref="allCheck" value="all" onChange={self.toggleBaseFilters.bind(null,'allCheck')}/><span>All users</span>
                            </div>
                        </If>
                        <div className="bButton" onClick={self.toggleFilters}>Filters {isFiltersActive ? '⇡' : '⇣'}</div>
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