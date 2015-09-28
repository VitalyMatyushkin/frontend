var List = require('module/ui/list/list'),
	ListField = require('module/ui/list/list_field'),
	Table = require('module/ui/list/table'),
	TableField = require('module/ui/list/table_field'),
	ListPageMixin = require('module/as_manager/pages/school_admin/list_page_mixin'),
	HousesListPage;

HousesListPage = React.createClass({
	mixins: [Morearty.Mixin, ListPageMixin],
	serviceName: 'houses',
    sandbox:true,
	getTableView: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Table title="Houses" binding={binding} onItemEdit={self._getEditFunction()} onFilterChange={self.updateData}>
				<TableField dataField="name" dataFieldKey="name" width="180px">House name</TableField>
				<TableField dataField="description" filterType="none">Description</TableField>
				<TableField dataField="colors" filterType="colors">Color</TableField>
			</Table>
		);
	}
});


module.exports = HousesListPage;
