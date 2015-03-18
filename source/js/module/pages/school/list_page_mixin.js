var ListPageMixin;

ListPageMixin = {
	propTypes: {
		formBinding: React.PropTypes.any.isRequired
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
			requestFilter,
			binding = self.getDefaultBinding(),
			isFiltersActive = binding.meta().get('isFiltersActive');

		self.request && self.request.abort();

		// Фильтрация по школе
		requestFilter = {
			where: {
				schoolId: self.activeSchoolId
			}
		};

		// Добавление фильтров по полям, если есть
		if (newFilter && isFiltersActive && Object.keys(newFilter).length > 0) {
			for (var filterName in newFilter) {
				requestFilter.where[filterName] = newFilter[filterName];
			}

			self.lastFiltersState = newFilter;
		}

		self.request = window.Server[self.serviceName].get({ filter: requestFilter }).then(function (data) {
			binding.set(Immutable.fromJS(data));
		})
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
			isFiltersActive = binding.meta().get('isFiltersActive');

		return (
			<div className={isFiltersActive ? 'bFiltersPage' : 'bFiltersPage mNoFilters'}>
				<h1 className="eSchoolMaster_title">{self.serviceName[0].toUpperCase() + self.serviceName.slice(1)}

					<div className="eSchoolMaster_buttons">
						<div className="bButton" onClick={self.toggleFilters}>Filters {isFiltersActive ? '⇡' : '⇣'}</div>
						<a href={document.location.hash + '/add'} className="bButton">Add...</a>
					</div>
				</h1>

				{self.getTableView()}

			</div>
		)
	}
};

module.exports = ListPageMixin;