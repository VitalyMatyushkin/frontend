var ListPageMixin;

ListPageMixin = {
	propTypes: {
		formBinding: React.PropTypes.any.isRequired,
		filters: React.PropTypes.object
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId');

		self.activeSchoolId = activeSchoolId;
		self.updateData();
	},
	updateData: function(newFilter) {
		var self = this,
			requestFilter,
			binding = self.getDefaultBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive');

		self.request && self.request.abort();

		// Фильтрация по школе
		requestFilter = {

		};

		// add custom filter
		if (typeof self.filters === 'object') {
			Object.keys(self.filters).forEach(function (filter) {
				requestFilter[filter] = self.filters[filter];
			});
		}

		// Добавление фильтров по полям, если есть
		if (newFilter && isFiltersActive && Object.keys(newFilter).length > 0) {
			for (var filterName in newFilter) {
				requestFilter.where[filterName] = newFilter[filterName];
			}

			self.lastFiltersState = newFilter;
		}

		self.request = window.Server.schoolOpponents.get(self.activeSchoolId).then(function (data) {
			binding.set(Immutable.fromJS(data));
		});
	},
	componentWillUnmount: function () {
		var self = this;

		self.request && self.request.abort();
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
			isFiltersActive = binding.meta().get('isFiltersActive');

		return (
			<div className="bSchoolMaster">
				<div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
					<h1 className="eSchoolMaster_title">Opponents list
					</h1>

					{self.getTableView()}

				</div>
			</div>
		)
	}
};

module.exports = ListPageMixin;