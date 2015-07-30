var ListPageMixin,
    If = require('module/ui/if/if'),
    GroupAction = require('module/ui/list/group_action'),
    Popup = require('module/ui/popup');
ListPageMixin = {
	propTypes: {
		formBinding: React.PropTypes.any.isRequired,
		filters: React.PropTypes.object,
		addSchoolToFilter: React.PropTypes.bool
	},
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		!self.serviceName && console.error('Please provide service name');
		self.activeSchoolId = activeSchoolId;
        self.popUpState = false;
		self.updateData();
	},
	updateData: function(newFilter) {
		var self = this,
			requestFilter = { where: {} },
            defaultRequestFilter ={where:{}},
			binding = self.getDefaultBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive');
        self.popUpState = true;
		self.request && self.request.abort();
		// Фильтрация по школе
		if (self.props.addSchoolToFilter !== false) {
			requestFilter.where.schoolId = self.activeSchoolId;
		}

		// add custom filter
		if (typeof self.filters === 'object') {
			Object.keys(self.filters).forEach(function (filter) {
				requestFilter[filter] = self.filters[filter];
                defaultRequestFilter[filter] = self.filters[filter];
			});
		}

		// Добавление фильтров по полям, если есть
		if (newFilter && isFiltersActive && Object.keys(newFilter).length > 0) {
			for (var filterName in newFilter) {
				requestFilter.where[filterName] = newFilter[filterName];
                if('limit' in (newFilter[filterName])){
                    defaultRequestFilter.limit = parseInt(newFilter[filterName].limit);
                }else if('order' in (newFilter[filterName])){
                    defaultRequestFilter.order = newFilter[filterName].order;
                }
                else{
                    defaultRequestFilter.where[filterName] = newFilter[filterName];
                }
			}
			self.lastFiltersState = newFilter;
		}
        //Column sorting without filters engaged
        if(newFilter && Object.keys(newFilter).length > 0){
            for(var filterName in newFilter){
                if('limit' in (newFilter[filterName])){
                    defaultRequestFilter.limit = parseInt(newFilter[filterName].limit);
                }else if('order' in (newFilter[filterName])){
                    defaultRequestFilter.order = newFilter[filterName].order;
                }
                else{
                    defaultRequestFilter.where[filterName] = newFilter[filterName];
                }
            }
        }
        //Condition to test for other service requests without ids
        if(self.activeSchoolId !== null){
            self.request = window.Server[self.serviceName].get(self.activeSchoolId, { filter: requestFilter }).then(function (data) {
                self.popUpState = false;
                binding.set(Immutable.fromJS(data));
            });
        }else{
            self.request = window.Server[self.serviceName].get({filter:defaultRequestFilter}).then(function (data) {
                self.popUpState = false;
                binding.set(Immutable.fromJS(data));
                //console.log(data);
            });
        }
	},
	componentWillUnmount: function () {
		var self = this;

		self.request && self.request.abort();
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
			self.updateData();
		} else {
			metaBinding.set('isFiltersActive', true);
			self.updateData(self.lastFiltersState);
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive'),
            currentPage = window.location.href.split('/'),
            excludeAddButton = ['logs','permissions'], //Add page name to this array if you don't want to display add button
            includeGroupAction = ['permissions','#admin_schools'],
            listPageTitle;
        if((currentPage[currentPage.length-1] === 'permissions'||currentPage[currentPage.length-1] ==='#admin_schools')){
            listPageTitle = 'Permissions ( '+globalBinding.get('userData.userInfo.firstName')+' '+globalBinding.get('userData.userInfo.lastName')+' - System Admin)';
        }else{
            listPageTitle = self.serviceName[0].toUpperCase() + self.serviceName.slice(1);
        }
		return (
			<div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
				<h1 className="eSchoolMaster_title">{listPageTitle}</h1>
                <div className="eSchoolMaster_groupAction">
                    <If condition={includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1}>
                        <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName}  binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
                    </If>
                    <div className="eSchoolMaster_buttons eSchoolMaster_buttons_admin">
                        <div className="bButton" onClick={self.toggleFilters}>Filters {isFiltersActive ? '⇡' : '⇣'}</div>
                        <If condition={excludeAddButton.indexOf(currentPage[currentPage.length-1]) === -1}>
                            <a href={document.location.hash + '/add'} className="bButton">Add...</a>
                        </If>
                    </div>
                </div>
				{self.getTableView()}
                <If condition={includeGroupAction.indexOf(currentPage[currentPage.length-1]) !== -1}>
                    <div className="eSchoolMaster_groupAction">
                        <div className="groupAction bottom_action">
                            <GroupAction groupActionFactory={self._getGroupActionsFactory} serviceName={self.serviceName} binding={self.getMoreartyContext().getBinding()} actionList={self.groupActionList} />
                        </div>
                    </div>
                </If>
                <Popup binding={binding} stateProperty={'popup'} initState={self.popUpState} otherClass="eSchoolMaster_loading">
                    Loading....
                </Popup>
			</div>
		)
	}
};

module.exports = ListPageMixin;