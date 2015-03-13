var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	HousesListPage;

HousesListPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		formBinding: React.PropTypes.any.isRequired
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		if (activeSchoolId) {
			self.request = window.Server.schoolHouses.get(activeSchoolId).then(function (data) {
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
						<a href="/#school/houses/add" className="bButton">Add...</div>
					</div>
				</h1>

				<Table title="Houses" binding={binding} onItemEdit={self._getEditFunction()} onAddNew={self._getAddFunction()}>
					<TableField dataField="name">House name</TableField>
					<TableField dataField="description">Description</TableField>
				</Table>

			</div>
		)
	}
});


module.exports = HousesListPage;
