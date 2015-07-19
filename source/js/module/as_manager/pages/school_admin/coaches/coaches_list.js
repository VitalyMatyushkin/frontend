var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	DateTimeMixin = require('module/mixins/datetime'),
	ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
	CoeachesListPage;

CoeachesListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin, DateTimeMixin],
	serviceName: 'schoolCoaches',
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Coaches" binding={binding} onItemEdit={self._getEditFunction()} onFilterChange={self.updateData}>
				<TableField width="20%" dataField="realms">Realms</TableField>
				<TableField width="20%" dataField="firstName">First name</TableField>
				<TableField width="20%" dataField="lastName">Last name</TableField>
				<TableField width="20%" dataField="email">Email</TableField>
				<TableField width="20%" dataField="phone">Phone</TableField>
			</Table>
		)
	}
});

module.exports = CoeachesListPage;
