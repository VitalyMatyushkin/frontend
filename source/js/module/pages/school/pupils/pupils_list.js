var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	PupilsListPage;

PupilsListPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		formBinding: React.PropTypes.any.isRequired
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;

		if (activeSchoolId) {
			self.request = window.Server.schoolLearners.get(activeSchoolId).then(function (data) {
				binding.set(Immutable.fromJS(data));
			});
		}
	},
	updateFilter: function(newFilter) {
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
				requestFilter.where[filterName] = {
					like: newFilter[filterName],
					options: 'i'
				}
			}
		}


		console.log({ filter: requestFilter })


		self.request = window.Server.learners.get({ filter: requestFilter }).then(function (data) {
			binding.set(Immutable.fromJS(data));
		})
	},
	componentWillUnmount: function () {
		var self = this;

		self.request && self.request.abort();
	},
	_getViewFunction: function() {
		var self = this;

		return function(data) {
			//var pageBinding = self.getMoreartyContext().getBinding().sub(page);

			//pageBinding.set('data', Immutable.fromJS(data));
			document.location.hash = 'pupil?id='+data.id;
			//document.location.hash = page + '?&schoolId='+data.schoolId+'&id='+data.id;
		}
	},
	_getEditFunction: function() {
		var self = this;

		return function(data) {
		//	self.props.formBinding.set(Immutable.fromJS(data));

			document.location.hash = 'school/pupils/edit?id='+data.id;
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<h1 className="eSchoolMaster_title">Pupils

					<div className="eSchoolMaster_buttons">
						<div className="bButton">Filters ⇣</div>
						<a href="/#school/pupils/add" className="bButton">Add...</a>
					</div>
				</h1>

				<Table title="Pupils" binding={binding} onItemView={self._getViewFunction()} onItemEdit={self._getEditFunction()} onFilterChange={self.updateFilter}>
					<TableField dataField="firstName">First name</TableField>
					<TableField dataField="lastName">Last name</TableField>
					<TableField dataField="age" filterType="number">Age</TableField>
					<TableField dataField="phone">Phone</TableField>
				</Table>

			</div>
		)
	}
});


module.exports = PupilsListPage;
