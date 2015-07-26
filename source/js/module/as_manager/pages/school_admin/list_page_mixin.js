var ListPageMixin,
    If = require('module/ui/if/if'),
    LogPagination = require('module/as_admin/pages/admin_schools/admin_comps/log_pagination');
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
		self.updateData();
	},
	updateData: function(newFilter) {
		var self = this,
			requestFilter = { where: {} },
            defaultRequestFilter ={where:{}},
			binding = self.getDefaultBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive');

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
                }else{
                    defaultRequestFilter.where[filterName] = newFilter[filterName];
                }
			}
			self.lastFiltersState = newFilter;
		}
        //Added this condition to test for other service requests without ids
        if(self.activeSchoolId !== null){
            self.request = window.Server[self.serviceName].get(self.activeSchoolId, { filter: requestFilter }).then(function (data) {
                binding.set(Immutable.fromJS(data));
            });
        }else{
            self.request = window.Server[self.serviceName].get({filter:defaultRequestFilter}).then(function (data) {
                //console.log(data);
                binding.set(Immutable.fromJS(data));
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
    getActionGroupList:function(){
        var self = this;
        if(self.groupActionList){
            return self.groupActionList.map(function(actionItem){
                return(
                    <div>{actionItem}</div>
                );
            });
        }
    },
    toggleGroupActionBox:function(groupBox){
        var self = this,
            el = React.findDOMNode(self.refs[groupBox]);
        if(el.style.display === 'none'){
            el.style.display = 'block';
        }else{
            el.style.display = 'none';
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive'),
            currentPage = window.location.href.split('/'),
            groupActionList = self.getActionGroupList(),
            excludeAddButton = ['logs','permissions'], //Add page name to this array if you don't want to display add button
            listPageTitle;
        if(currentPage[currentPage.length-1] === 'permissions'){
            listPageTitle = 'Permissions ( '+globalBinding.get('userData.userInfo.firstName')+' '+globalBinding.get('userData.userInfo.lastName')+' - System Admin)';
        }else{
            listPageTitle = self.serviceName[0].toUpperCase() + self.serviceName.slice(1);
        }
		return (
			<div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
				<h1 className="eSchoolMaster_title">{listPageTitle}</h1>
                <div className="eSchoolMaster_groupAction">
                    <If condition={currentPage[currentPage.length-1] === 'permissions'}>
                        <div className="groupAction">
                            <div className="groupAction_item"><input type="checkbox"/> Check All</div>
                            <div className="groupAction_item">
                                <span className="groupMenu">
                                    <span className="caret" onClick={function(){self.toggleGroupActionBox('topGroup')}}></span>
                                    <div ref="topGroup" className="groupActionList">
                                        {groupActionList}
                                    </div>
                                </span>
                            </div>
                            <div className="groupAction_item"><span className="applyAction">Apply</span></div>
                        </div>
                    </If>
                    <div className="eSchoolMaster_buttons eSchoolMaster_buttons_admin">
                        <div className="bButton" onClick={self.toggleFilters}>Filters {isFiltersActive ? '⇡' : '⇣'}</div>
                        <If condition={excludeAddButton.indexOf(currentPage[currentPage.length-1]) === -1}>
                            <a href={document.location.hash + '/add'} className="bButton">Add...</a>
                        </If>
                    </div>
                </div>
				{self.getTableView()}
                <If condition={currentPage[currentPage.length-1] === 'permissions'}>
                    <div className="eSchoolMaster_groupAction">
                        <div className="groupAction bottom_action">
                            <div className="groupAction_item"><input type="checkbox"/> Check All</div>
                            <div className="groupAction_item">
                                <span className="groupMenu">
                                    <span className="caret" onClick={function(){self.toggleGroupActionBox('btmGroup')}}></span>
                                    <div ref="btmGroup" className="groupActionList">
                                        {groupActionList}
                                    </div>
                                </span>
                            </div>
                            <div className="groupAction_item"><span className="applyAction">Apply</span></div>
                        </div>
                    </div>
                </If>
			</div>
		)
	}
};

module.exports = ListPageMixin;