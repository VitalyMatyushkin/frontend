var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
	ClassListPage;

ClassListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'forms',
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Classes" binding={binding} onItemEdit={self._getEditFunction()} onFilterChange={self.updateData}>
				<TableField width="40%" dataField="name">First name</TableField>
				<TableField width="40%" dataField="age" filterType="number">Age</TableField>
			</Table>
		)
	}
});


module.exports = ClassListPage;
