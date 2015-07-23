var ListPageMixin,
    If = require('module/ui/if/if');

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
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive'),
            currentPage = window.location.href.split('/');
		return (
			<div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
				<h1 className="eSchoolMaster_title">{self.serviceName[0].toUpperCase() + self.serviceName.slice(1)}
					<div className="eSchoolMaster_buttons">
						<div className="bButton" onClick={self.toggleFilters}>Filters {isFiltersActive ? '⇡' : '⇣'}</div>
                        <If condition={currentPage[currentPage.length-1] !== 'logs'}>
                            <a href={document.location.hash + '/add'} className="bButton">Add...</a>
                        </If>
					</div>
				</h1>

				{self.getTableView()}

			</div>
		)
	}
};

module.exports = ListPageMixin;