var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	HousesListPage;
//⇡ ⇣
HousesListPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		formBinding: React.PropTypes.any.isRequired
	},
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
		self.updateData();
	},
	updateData: function(newFilter) {
		var self = this,
			requestFilter,
			binding = self.getDefaultBinding();

		self.request && self.request.abort();

		// Фильтрация по школе
		requestFilter = {
			where: {
				schoolId: self.activeSchoolId
			}
		};

		// Добавление фильтров по полям, если есть
		if (newFilter && Object.keys(newFilter).length > 0) {
			for (var filterName in newFilter) {
				requestFilter.where[filterName] = newFilter[filterName];
			}
		}

		self.request = window.Server.houses.get({ filter: requestFilter }).then(function (data) {
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

			document.location.hash = 'school/houses/edit?id='+data.id;
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<h1 className="eSchoolMaster_title">Houses

					<div className="eSchoolMaster_buttons">
						<div className="bButton">Filters ⇣</div>
						<a href="/#school/houses/add" className="bButton">Add...</a>
					</div>
				</h1>

				<Table title="Houses" binding={binding} onItemEdit={self._getEditFunction()} onFilterChange={self.updateData}>
					<TableField dataField="name" width="180">House name</TableField>
					<TableField dataField="description">Description</TableField>
				</Table>

			</div>
		)
	}
});


module.exports = HousesListPage;
