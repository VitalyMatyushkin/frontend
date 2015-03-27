var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
	StudentsListPage;

StudentsListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'students',
	_getViewFunction: function() {
		var self = this;

		return function(data) {
			//var pageBinding = self.getMoreartyContext().getBinding().sub(page);

			//pageBinding.set('data', Immutable.fromJS(data));
			document.location.hash = 'student?id='+data.id;
			//document.location.hash = page + '?&schoolId='+data.schoolId+'&id='+data.id;
		}
	},
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Students" binding={binding} onItemView={self._getViewFunction()} onItemEdit={self._getEditFunction()} onFilterChange={self.updateData}>
				<TableField width="20%" dataField="firstName">First name</TableField>
				<TableField width="20%" dataField="lastName">Last name</TableField>
				<TableField width="20%" dataField="gender">Gender</TableField>
				<TableField width="20%" dataField="phone">Phone</TableField>
			</Table>
		)
	}
});


module.exports = StudentsListPage;
